from fastapi import APIRouter, HTTPException, Depends, status, Path, Body
from typing import List

from app.schemas.valuation_schemas import (
    PropertyValuationCreate,
    PropertyValuationUpdate,
    PropertyValuationPublic,
    PropertyValuationWithCompsPublic, # For responses that include comps
    ValuationCompCreate,
    ValuationCompPublic, # For comp responses
    PaginatedPropertyValuations
)
from app.services.valuation_service import ValuationService
from app.services.property_service import PropertyService # To check property existence

router = APIRouter()

def get_valuation_service() -> ValuationService:
    return ValuationService()

def get_property_service() -> PropertyService:
    return PropertyService()


# --- PropertyValuation Endpoints ---

@router.post(
    "/",
    response_model=PropertyValuationPublic,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new property valuation record"
)
async def create_new_valuation(
    valuation_data: PropertyValuationCreate,
    service: ValuationService = Depends(get_valuation_service),
    property_service: PropertyService = Depends(get_property_service)
):
    # Check if the parent property exists
    parent_property = await property_service.get_property_by_id(valuation_data.property_id)
    if not parent_property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with id {valuation_data.property_id} not found. Cannot create valuation."
        )

    created_valuation = await service.create_valuation(valuation_data=valuation_data)
    return created_valuation

@router.get(
    "/{valuation_id}",
    response_model=PropertyValuationWithCompsPublic, # Return valuation with its comps
    summary="Retrieve a specific valuation with its comparables"
)
async def read_valuation_details(
    valuation_id: int = Path(..., gt=0),
    service: ValuationService = Depends(get_valuation_service)
):
    valuation_with_comps = await service.get_valuation_with_comps(valuation_id=valuation_id)
    if not valuation_with_comps:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Valuation not found")
    return valuation_with_comps

@router.get(
    "/property/{property_id}",
    response_model=PaginatedPropertyValuations,
    summary="List all valuations for a specific property"
)
async def read_valuations_for_property(
    property_id: int = Path(..., gt=0),
    skip: int = 0,
    limit: int = Query(10, ge=1, le=100), # Default to 10 per page for valuations
    service: ValuationService = Depends(get_valuation_service)
):
    valuations_list = await service.get_valuations_for_property(
        property_id=property_id, skip=skip, limit=limit
    )
    total_count = await service.get_valuations_for_property_count(property_id=property_id)

    return PaginatedPropertyValuations(
        limit=limit,
        offset=skip,
        total=total_count,
        items=valuations_list
    )

@router.put(
    "/{valuation_id}",
    response_model=PropertyValuationPublic,
    summary="Update an existing property valuation"
)
async def update_existing_valuation(
    valuation_id: int = Path(..., gt=0),
    valuation_update_data: PropertyValuationUpdate = Body(...),
    service: ValuationService = Depends(get_valuation_service)
):
    updated_valuation = await service.update_valuation(
        valuation_id=valuation_id, valuation_update_data=valuation_update_data
    )
    if not updated_valuation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Valuation not found or no data to update")
    return updated_valuation

@router.delete(
    "/{valuation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a property valuation (and its linked comps via CASCADE)"
)
async def delete_existing_valuation(
    valuation_id: int = Path(..., gt=0),
    service: ValuationService = Depends(get_valuation_service)
):
    deleted = await service.delete_valuation(valuation_id=valuation_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Valuation not found")
    return None


# --- ValuationComp Endpoints (nested under a specific valuation) ---

@router.post(
    "/{valuation_id}/comparables",
    response_model=ValuationCompPublic, # Return the created comp with its historical sale data
    status_code=status.HTTP_201_CREATED,
    summary="Add a comparable sale to a valuation"
)
async def add_comparable_to_valuation(
    valuation_id: int = Path(..., gt=0),
    comp_data: ValuationCompCreate = Body(...),
    service: ValuationService = Depends(get_valuation_service)
    # Consider adding a check here if the historical_sale_id in comp_data actually exists
    # from app.services.historical_sale_service import HistoricalSaleService (beware of circular deps if services call each other)
):
    # The service method get_comps_for_valuation now enriches the historical_sale data
    # So we need to fetch the newly created comp and then enrich it for the response.
    # Or the service method add_comp_to_valuation could return the enriched object.
    # For now, let's assume add_comp_to_valuation returns a basic ValuationCompInDB.
    # We will then fetch the enriched version.

    created_comp_base = await service.add_comp_to_valuation(valuation_id=valuation_id, comp_data=comp_data)
    if not created_comp_base:
        # This could be due to valuation not found, historical sale not found, or duplicate comp
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not add comparable. Valuation or historical sale might not exist, or comparable already added.")

    # To return the full ValuationCompPublic with enriched historical_sale:
    # This is a bit inefficient (extra DB call). Ideally, add_comp_to_valuation would return the enriched object.
    # For now, let's fetch all comps for the valuation and find the one we just added.
    # A better way: modify service.add_comp_to_valuation to do the join and return enriched data.
    # Assuming for now, we return the basic one and client might re-fetch the valuation with all comps.
    # Let's simplify for the response here and return the created_comp_base (as ValuationCompInDB)
    # and the client can then re-fetch GET /{valuation_id} to get all enriched comps.
    # Or, for a better UX, let's make the service return the enriched object.
    # (Refactoring service.add_comp_to_valuation would be needed for that)

    # For this version, let's just return what the service gives (ValuationCompInDB),
    # and the schema will adapt. Or make the service return a richer object if needed.
    # Let's assume we fetch the enriched comps list and return the specific one.
    all_comps = await service.get_comps_for_valuation(valuation_id)
    newly_added_enriched_comp = next((c for c in all_comps if c.historical_sale_id == comp_data.historical_sale_id), None)

    if not newly_added_enriched_comp: # Should not happen if creation was successful
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving created comparable details.")

    return newly_added_enriched_comp


@router.get(
    "/{valuation_id}/comparables",
    response_model=List[ValuationCompPublic],
    summary="List all comparables for a specific valuation"
)
async def read_comparables_for_valuation(
    valuation_id: int = Path(..., gt=0),
    service: ValuationService = Depends(get_valuation_service)
):
    # Check if valuation exists first
    valuation = await service.get_valuation_by_id(valuation_id=valuation_id)
    if not valuation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Valuation not found")

    comps = await service.get_comps_for_valuation(valuation_id=valuation_id)
    return comps

@router.delete(
    "/{valuation_id}/comparables/{historical_sale_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove a specific comparable sale from a valuation"
)
async def remove_comparable_from_valuation(
    valuation_id: int = Path(..., gt=0),
    historical_sale_id: int = Path(..., gt=0, description="ID of the HistoricalSale record to remove as a comp"),
    service: ValuationService = Depends(get_valuation_service)
):
    deleted = await service.remove_comp_from_valuation(
        valuation_id=valuation_id, historical_sale_id=historical_sale_id
    )
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comparable link not found or already deleted")
    return None


# --- AVM Calculation Endpoint ---

class CompAdjustmentItem(BaseModel):
    historical_sale_id: int = Field(..., description="ID of the comparable historical sale")
    total_adjustment_value: float = Field(..., description="Net monetary adjustment for this comparable (positive or negative)")

class CalculateAVMRequest(BaseModel):
    comp_adjustments: List[CompAdjustmentItem] = Field(..., description="List of comparables and their total adjustments")

@router.post(
    "/{valuation_id}/calculate_avm",
    # response_model=PropertyValuationPublic, # The AVM value is updated on the valuation
    response_model=Dict[str, Any], # Or a more specific AVM result schema
    summary="Calculate an assisted AVM value based on banker adjustments to comparables"
)
async def calculate_valuation_avm(
    valuation_id: int = Path(..., gt=0),
    request_body: CalculateAVMRequest = Body(...),
    service: ValuationService = Depends(get_valuation_service)
):
    """
    Calculates an assisted AVM for a given valuation by applying banker-provided
    adjustments to its selected comparables. The `avm_estimated_value` on the
    PropertyValuation record is updated with the result.
    """
    avm_result = await service.calculate_assisted_avm(
        valuation_id=valuation_id,
        comp_adjustments=[adj.model_dump() for adj in request_body.comp_adjustments] # Convert Pydantic models to dicts
    )
    if not avm_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Valuation not found or no comparables associated to calculate AVM."
        )

    # The service method already updated the valuation with the avm_estimated_value.
    # The response contains the detailed calculation results.
    return avm_result

```
