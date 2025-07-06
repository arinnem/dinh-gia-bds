from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional

from app.schemas.property_schemas import (
    PropertyCreate,
    PropertyUpdate,
    PropertyPublic,
    PaginatedProperties
)
from app.services.property_service import PropertyService

router = APIRouter()

def get_property_service() -> PropertyService:
    return PropertyService()

@router.post("/", response_model=PropertyPublic, status_code=status.HTTP_201_CREATED)
async def create_new_property(
    property_data: PropertyCreate, # This can come from manual entry or scraper output
    service: PropertyService = Depends(get_property_service)
):
    """
    Create a new property.
    If `listing_url` is provided and already exists, this might update the existing property
    (depending on service logic, useful for scraper data).
    """
    # The service's create_property method handles the upsert-like logic
    created_property = await service.create_property(property_data=property_data)
    if not created_property: # Should not happen if create_property is robust
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not create or update property")
    return created_property

@router.get("/{property_id}", response_model=PropertyPublic)
async def read_property(
    property_id: int,
    service: PropertyService = Depends(get_property_service)
):
    """
    Retrieve a specific property by its ID.
    """
    prop = await service.get_property_by_id(property_id=property_id)
    if not prop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return prop

@router.get("/", response_model=PaginatedProperties)
async def read_properties_list(
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(10, ge=1, le=200, description="Maximum number of records to return"), # Smaller default limit
    address_full: Optional[str] = Query(None, description="Filter by full address (supports partial match, case-insensitive)"),
    address_city: Optional[str] = Query(None, description="Filter by city (supports partial match, case-insensitive)"),
    address_district: Optional[str] = Query(None, description="Filter by district (supports partial match, case-insensitive)"),
    property_type: Optional[str] = Query(None, description="Filter by property type (exact match)"),
    min_land_area_sqm: Optional[float] = Query(None, gt=0, description="Minimum land area"),
    max_land_area_sqm: Optional[float] = Query(None, gt=0, description="Maximum land area"),
    min_listing_price: Optional[float] = Query(None, gt=0, description="Minimum listing price"),
    max_listing_price: Optional[float] = Query(None, gt=0, description="Maximum listing price"),
    data_source_listing: Optional[str] = Query(None, description="Filter by data source of the listing"),
    service: PropertyService = Depends(get_property_service)
):
    """
    Retrieve a list of properties with pagination and filtering.
    """
    filters = {
        "address_full": address_full,
        "address_city": address_city,
        "address_district": address_district,
        "property_type": property_type,
        # Add more direct filters based on exact matches or ranges if needed in service
        # The service currently implements basic text ILIKE for some string fields.
        # For range filters like area or price, the service would need specific logic.
        # For simplicity, passing them as is, service needs to handle them.
        "land_area_sqm_gte": min_land_area_sqm, # Example: Greater than or equal
        "land_area_sqm_lte": max_land_area_sqm, # Example: Less than or equal
        "listing_price_gte": min_listing_price,
        "listing_price_lte": max_listing_price,
        "data_source_listing": data_source_listing
    }
    # Remove None values from filters before passing to service
    active_filters = {k: v for k, v in filters.items() if v is not None}

    properties_list = await service.get_properties(skip=skip, limit=limit, filters=active_filters)
    total_count = await service.get_properties_count(filters=active_filters)

    return PaginatedProperties(
        limit=limit,
        offset=skip,
        total=total_count,
        items=properties_list
    )

@router.put("/{property_id}", response_model=PropertyPublic)
async def update_existing_property(
    property_id: int,
    property_update_data: PropertyUpdate,
    service: PropertyService = Depends(get_property_service)
):
    """
    Update an existing property record.
    """
    updated_property = await service.update_property(
        property_id=property_id,
        property_update_data=property_update_data
    )
    if not updated_property:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found or update failed")
    return updated_property

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_property(
    property_id: int,
    service: PropertyService = Depends(get_property_service)
):
    """
    Delete a property record.
    Related valuations and legal information might be deleted via CASCADE if DB is set up that way.
    """
    deleted = await service.delete_property(property_id=property_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Property not found")
    return None

@router.get("/{property_id}/suggest_comps", response_model=List[PropertyPublic]) # Should actually be HistoricalSalePublic
async def suggest_comparables_for_property(
    property_id: int = Path(..., gt=0, description="The ID of the subject property"),
    max_distance_km: Optional[float] = Query(5.0, gt=0, description="Maximum distance in km for comps"),
    date_window_months: Optional[int] = Query(6, gt=0, le=24, description="Lookback period in months for comp sales"),
    area_tolerance_percent: Optional[float] = Query(0.20, ge=0, le=0.5, description="Area tolerance as a percentage (e.g., 0.2 for +/-20%)"),
    max_results: Optional[int] = Query(5, ge=1, le=10, description="Maximum number of comps to suggest"),
    service: PropertyService = Depends(get_property_service)
):
    """
    Suggests comparable sales for a given property based on proximity, sale date, property type, and area.
    Note: The response model should ideally be `List[HistoricalSalePublic]`.
    This current setup might need adjustment if `PropertyPublic` is not suitable for representing historical sales.
    For now, assuming the service returns dicts that can be cast or the API layer adapts.
    A more accurate response_model would be `List[app.schemas.historical_sale_schemas.HistoricalSalePublic]`.
    Let's refine this to use the correct schema.
    """
    from app.schemas.historical_sale_schemas import HistoricalSalePublic as HistoricalSaleSchemaForComp # Alias for clarity

    suggested_comps_data = await service.suggest_comparables(
        property_id=property_id,
        max_distance_km=max_distance_km,
        date_window_months=date_window_months,
        area_tolerance_percent=area_tolerance_percent,
        max_results=max_results
    )
    if not suggested_comps_data: # Could be empty list if no comps found, or None if property_id invalid
        # If service returns [] for no comps, this check might not be needed,
        # an empty list is a valid response.
        # If service returns None for "property not found", then:
        # raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject property not found")
        pass # Allow empty list to be returned

    # Convert list of dicts to list of HistoricalSaleSchemaForComp
    # This assumes the dicts from service.suggest_comparables match the fields of HistoricalSaleSchemaForComp
    # (which they should, as they are records from HistoricalSales table)
    response_comps = [HistoricalSaleSchemaForComp(**comp_data) for comp_data in suggested_comps_data]
    return response_comps
```
