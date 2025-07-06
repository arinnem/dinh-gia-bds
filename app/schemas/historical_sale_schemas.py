from pydantic import BaseModel, Field
from typing import Optional, Union
from datetime import date, datetime

class HistoricalSaleBase(BaseModel):
    address_full: str = Field(..., example="123 Main St, District 1, Ho Chi Minh City")
    address_city: Optional[str] = Field(None, example="Ho Chi Minh City")
    address_district: Optional[str] = Field(None, example="District 1")
    address_ward: Optional[str] = Field(None, example="Ben Nghe")
    latitude: Optional[float] = Field(None, example=10.7769)
    longitude: Optional[float] = Field(None, example=106.7009)
    sale_date: date = Field(..., example="2023-05-15")
    sale_price: float = Field(..., gt=0, example=5000000000) # Greater than 0
    sale_price_currency: str = Field(default='VND', example="VND")
    property_type: Optional[str] = Field(None, example="APARTMENT") # E.g., 'APARTMENT', 'HOUSE', 'LAND'
    land_area_sqm: Optional[float] = Field(None, gt=0, example=80.5)
    floor_area_sqm: Optional[float] = Field(None, gt=0, example=75.0)
    year_built: Optional[int] = Field(None, gt=1800, lt=2100, example=2010) # Realistic year range
    data_source: str = Field(..., example="ManualBankerEntry") # E.g., 'ManualBankerEntry', 'GovPortalScraped'
    source_details_url_or_ref: Optional[str] = Field(None, example="Bank internal record #XYZ")
    is_verified_by_banker: Optional[bool] = Field(default=False)
    banker_notes: Optional[str] = Field(None, example="Verified via phone call with agent.")

class HistoricalSaleCreate(HistoricalSaleBase):
    pass

class HistoricalSaleUpdate(BaseModel):
    # All fields are optional for update
    address_full: Optional[str] = Field(None, example="123 Main St, District 1, Ho Chi Minh City")
    address_city: Optional[str] = Field(None, example="Ho Chi Minh City")
    address_district: Optional[str] = Field(None, example="District 1")
    address_ward: Optional[str] = Field(None, example="Ben Nghe")
    latitude: Optional[float] = Field(None, example=10.7769)
    longitude: Optional[float] = Field(None, example=106.7009)
    sale_date: Optional[date] = Field(None, example="2023-05-15")
    sale_price: Optional[float] = Field(None, gt=0, example=5200000000)
    sale_price_currency: Optional[str] = Field(None, example="VND")
    property_type: Optional[str] = Field(None, example="APARTMENT")
    land_area_sqm: Optional[float] = Field(None, gt=0, example=80.5)
    floor_area_sqm: Optional[float] = Field(None, gt=0, example=75.0)
    year_built: Optional[int] = Field(None, gt=1800, lt=2100, example=2010)
    data_source: Optional[str] = Field(None, example="ManualBankerEntryUpdated")
    source_details_url_or_ref: Optional[str] = Field(None, example="Bank internal record #XYZ - updated")
    is_verified_by_banker: Optional[bool] = Field(None)
    banker_notes: Optional[str] = Field(None, example="Verification confirmed by manager.")


class HistoricalSaleInDB(HistoricalSaleBase):
    sale_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True # Changed from orm_mode for Pydantic v2

# Schema for response model when listing multiple sales
class HistoricalSalePublic(HistoricalSaleInDB): # Or could be HistoricalSaleBase + id, created_at, updated_at
    pass

class PaginatedHistoricalSales(BaseModel):
    limit: int
    offset: int
    total: int
    items: list[HistoricalSalePublic]

```
