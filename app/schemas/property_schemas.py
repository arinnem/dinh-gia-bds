from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime, date # Added date for consistency if needed

class PropertyBase(BaseModel):
    address_full: Optional[str] = Field(None, example="456 Oak Avenue, District 2, Ho Chi Minh City")
    address_city: Optional[str] = Field(None, example="Ho Chi Minh City")
    address_district: Optional[str] = Field(None, example="District 2")
    address_ward: Optional[str] = Field(None, example="An Phu")
    latitude: Optional[float] = Field(None, example=10.789)
    longitude: Optional[float] = Field(None, example=106.712)
    property_type: Optional[str] = Field(None, example="HOUSE") # E.g., 'APARTMENT', 'HOUSE', 'LAND', 'VILLA'
    land_area_sqm: Optional[float] = Field(None, gt=0, example=120.0)
    floor_area_sqm: Optional[float] = Field(None, gt=0, example=200.0)
    num_storeys: Optional[int] = Field(None, ge=0, example=3)
    num_bedrooms: Optional[int] = Field(None, ge=0, example=4)
    num_bathrooms: Optional[int] = Field(None, ge=0, example=3)
    year_built: Optional[int] = Field(None, gt=1800, lt=2100, example=2015)
    description: Optional[str] = Field(None, example="Spacious house with garden and good view.")
    listing_url: Optional[HttpUrl] = Field(None, example="http://example.com/listing/123")
    listing_price: Optional[float] = Field(None, gt=0, example=15000000000)
    listing_price_currency: Optional[str] = Field(default='VND', example="VND")
    data_source_listing: Optional[str] = Field(None, example="batdongsan.com.vn") # or 'alonhadat.com.vn', 'manual_entry'
    scraped_at: Optional[datetime] = Field(None, description="Timestamp of when the listing was last scraped/updated")

class PropertyCreate(PropertyBase):
    # For creation, some fields might be more strictly required if not scraped
    # For now, keeping it flexible like PropertyBase
    address_full: str = Field(..., example="456 Oak Avenue, District 2, Ho Chi Minh City") # Make address_full required for create


class PropertyUpdate(BaseModel):
    address_full: Optional[str] = Field(None)
    address_city: Optional[str] = Field(None)
    address_district: Optional[str] = Field(None)
    address_ward: Optional[str] = Field(None)
    latitude: Optional[float] = Field(None)
    longitude: Optional[float] = Field(None)
    property_type: Optional[str] = Field(None)
    land_area_sqm: Optional[float] = Field(None, gt=0)
    floor_area_sqm: Optional[float] = Field(None, gt=0)
    num_storeys: Optional[int] = Field(None, ge=0)
    num_bedrooms: Optional[int] = Field(None, ge=0)
    num_bathrooms: Optional[int] = Field(None, ge=0)
    year_built: Optional[int] = Field(None, gt=1800, lt=2100)
    description: Optional[str] = Field(None)
    listing_url: Optional[HttpUrl] = Field(None)
    listing_price: Optional[float] = Field(None, gt=0)
    listing_price_currency: Optional[str] = Field(None)
    data_source_listing: Optional[str] = Field(None)
    scraped_at: Optional[datetime] = Field(None)


class PropertyInDB(PropertyBase):
    property_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Schema for public response
class PropertyPublic(PropertyInDB):
    pass

class PaginatedProperties(BaseModel):
    limit: int
    offset: int
    total: int
    items: List[PropertyPublic]
```
