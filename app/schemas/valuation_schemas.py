from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date

from app.schemas.historical_sale_schemas import HistoricalSalePublic # To embed comp details

# --- PropertyValuation Schemas ---

class PropertyValuationBase(BaseModel):
    valuation_date: date = Field(..., example="2024-07-15")
    avm_estimated_value: Optional[float] = Field(None, gt=0, example=12000000000.00)
    banker_adjusted_value: float = Field(..., gt=0, example=12500000000.00)
    valuation_currency: str = Field(default='VND', example="VND")
    valuation_notes: Optional[str] = Field(None, example="Adjusted upwards due to recent renovations not fully captured by AVM.")

class PropertyValuationCreate(PropertyValuationBase):
    property_id: int

class PropertyValuationUpdate(BaseModel):
    valuation_date: Optional[date] = None
    avm_estimated_value: Optional[float] = Field(None, gt=0)
    banker_adjusted_value: Optional[float] = Field(None, gt=0)
    valuation_currency: Optional[str] = None
    valuation_notes: Optional[str] = None

class PropertyValuationInDB(PropertyValuationBase):
    valuation_id: int
    property_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PropertyValuationPublic(PropertyValuationInDB):
    pass


# --- ValuationComp Schemas ---

class ValuationCompBase(BaseModel):
    historical_sale_id: int = Field(..., description="ID of the historical sale used as a comparable")
    is_auto_suggested: Optional[bool] = Field(default=False, description="Was this comp suggested by the system?")
    selection_rationale: Optional[str] = Field(None, description="Banker's rationale for choosing/adjusting this comp")

class ValuationCompCreate(ValuationCompBase):
    # valuation_id will be path parameter or part of a bulk create for a valuation
    pass

# No ValuationCompUpdate schema for now, typically comps are added/removed, not individually updated in this context.
# If individual fields like 'selection_rationale' need update, a specific schema could be made.

class ValuationCompInDB(ValuationCompBase):
    valuation_comp_id: int
    valuation_id: int # The valuation this comp belongs to

    class Config:
        from_attributes = True

class ValuationCompPublic(ValuationCompInDB):
    # Optionally include full details of the historical sale
    historical_sale: Optional[HistoricalSalePublic] = None

# --- Enhanced PropertyValuation Schemas with Comps ---

class PropertyValuationWithCompsPublic(PropertyValuationPublic):
    comparables: List[ValuationCompPublic] = []


class PaginatedPropertyValuations(BaseModel):
    limit: int
    offset: int
    total: int
    items: List[PropertyValuationPublic] # Could be PropertyValuationWithCompsPublic if always fetching comps

```
