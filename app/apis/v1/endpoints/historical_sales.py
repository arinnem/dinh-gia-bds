from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional

from app.schemas.historical_sale_schemas import (
    HistoricalSaleCreate,
    HistoricalSaleUpdate,
    HistoricalSalePublic, # Using this for single and list responses
    PaginatedHistoricalSales
)
from app.services.historical_sale_service import HistoricalSaleService

router = APIRouter()

# Dependency to get the service instance
# This could also be managed with a more sophisticated DI system if needed
def get_historical_sale_service() -> HistoricalSaleService:
    return HistoricalSaleService()

@router.post("/", response_model=HistoricalSalePublic, status_code=status.HTTP_201_CREATED)
async def create_new_historical_sale(
    sale_data: HistoricalSaleCreate,
    service: HistoricalSaleService = Depends(get_historical_sale_service)
):
    """
    Create a new historical sale record.
    Primarily for manual data entry by bankers.
    """
    created_sale = await service.create_historical_sale(sale_data=sale_data)
    return created_sale

@router.get("/{sale_id}", response_model=HistoricalSalePublic)
async def read_historical_sale(
    sale_id: int,
    service: HistoricalSaleService = Depends(get_historical_sale_service)
):
    """
    Retrieve a specific historical sale by its ID.
    """
    sale = await service.get_historical_sale_by_id(sale_id=sale_id)
    if not sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historical sale not found")
    return sale

@router.get("/", response_model=PaginatedHistoricalSales)
async def read_historical_sales_list(
    skip: int = Query(0, ge=0, description="Number of records to skip for pagination"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records to return"),
    # Add filter parameters here as needed, e.g.:
    # address_query: Optional[str] = Query(None, description="Search term for address"),
    # property_type: Optional[str] = Query(None, description="Filter by property type"),
    # min_sale_price: Optional[float] = Query(None, gt=0, description="Minimum sale price"),
    service: HistoricalSaleService = Depends(get_historical_sale_service)
):
    """
    Retrieve a list of historical sales with pagination.
    This endpoint will be used to browse historical sales for manual comp selection.
    Filtering capabilities can be expanded.
    """
    # Basic filter construction (can be moved to service layer for more complexity)
    # filters = {}
    # if address_query: filters["address_full_ilike"] = f"%{address_query}%" # Example for ILIKE
    # if property_type: filters["property_type"] = property_type
    # if min_sale_price: filters["sale_price_gte"] = min_sale_price

    sales_list = await service.get_historical_sales(skip=skip, limit=limit, filters=None) # Pass actual filters
    total_count = await service.get_historical_sales_count(filters=None) # Pass actual filters

    return PaginatedHistoricalSales(
        limit=limit,
        offset=skip,
        total=total_count,
        items=sales_list
    )

@router.put("/{sale_id}", response_model=HistoricalSalePublic)
async def update_existing_historical_sale(
    sale_id: int,
    sale_update_data: HistoricalSaleUpdate,
    service: HistoricalSaleService = Depends(get_historical_sale_service)
):
    """
    Update an existing historical sale record.
    """
    updated_sale = await service.update_historical_sale(sale_id=sale_id, sale_update_data=sale_update_data)
    if not updated_sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historical sale not found or no data to update")
    return updated_sale

@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_historical_sale(
    sale_id: int,
    service: HistoricalSaleService = Depends(get_historical_sale_service)
):
    """
    Delete a historical sale record.
    """
    deleted = await service.delete_historical_sale(sale_id=sale_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Historical sale not found")
    return None # Return None for 204 No Content
```
