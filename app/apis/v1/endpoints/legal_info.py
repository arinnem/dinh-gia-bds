from fastapi import APIRouter, HTTPException, Depends, status, Path

from app.schemas.legal_info_schemas import (
    LegalInformationCreate, # Used for both create and full update body
    LegalInformationUpdate, # Could be used for PATCH, but service handles partial updates via Create schema too
    LegalInformationPublic
)
from app.services.legal_info_service import LegalInformationService
from app.services.property_service import PropertyService # To check if property exists

router = APIRouter()

def get_legal_info_service() -> LegalInformationService:
    return LegalInformationService()

def get_property_service() -> PropertyService: # Dependency for property existence check
    return PropertyService()

@router.put("/{property_id}", response_model=LegalInformationPublic) # Using PUT for create/replace semantics
async def create_or_update_property_legal_info(
    property_id: int = Path(..., gt=0, description="The ID of the property to associate legal info with"),
    legal_data_in: LegalInformationCreate, # Request body
    service: LegalInformationService = Depends(get_legal_info_service),
    property_service: PropertyService = Depends(get_property_service)
):
    """
    Create or update the legal information for a specific property.
    Since LegalInformation has a one-to-one relationship with a Property (via unique property_id),
    this endpoint effectively acts as an "upsert".
    It requires the property_id in the path and also in the body to match.
    """
    if property_id != legal_data_in.property_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Property ID in path does not match property ID in request body."
        )

    # Check if the property itself exists
    property_exists = await property_service.get_property_by_id(property_id)
    if not property_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Property with id {property_id} not found. Cannot add/update legal info."
        )

    legal_info = await service.create_or_update_legal_info(
        property_id=property_id, legal_data=legal_data_in
    )
    if not legal_info:
        # This might happen if there was an unexpected issue during upsert
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create or update legal information")
    return legal_info

@router.get("/{property_id}", response_model=LegalInformationPublic)
async def read_property_legal_info(
    property_id: int = Path(..., gt=0, description="The ID of the property whose legal info is to be retrieved"),
    service: LegalInformationService = Depends(get_legal_info_service)
):
    """
    Retrieve legal information for a specific property.
    """
    legal_info = await service.get_legal_info_by_property_id(property_id=property_id)
    if not legal_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal information not found for this property")
    return legal_info

@router.delete("/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_property_legal_info(
    property_id: int = Path(..., gt=0, description="The ID of the property whose legal info is to be deleted"),
    service: LegalInformationService = Depends(get_legal_info_service)
):
    """
    Delete legal information for a specific property.
    """
    deleted = await service.delete_legal_info_by_property_id(property_id=property_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal information not found for this property, cannot delete")
    return None
```
