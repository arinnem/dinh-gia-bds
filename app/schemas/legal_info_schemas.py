from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date

class LegalInformationBase(BaseModel):
    # Zoning Info
    zoning_classification: Optional[str] = Field(None, example="Residential Land ODT")
    zoning_master_plan_ref: Optional[str] = Field(None, example="Master Plan No. 123/QD-UBND")
    zoning_notes: Optional[str] = Field(None, example="Compliant with current master plan. High density residential allowed.")
    zoning_data_source: Optional[str] = Field(None, example="ManualBankerEntry - Local Planning Office")
    zoning_source_url_or_ref: Optional[str] = Field(None, example="Ref: Document XYZ from Planning Dept.")

    # Dispute Status
    dispute_status_summary: Optional[str] = Field(None, example="No known disputes") # E.g., 'No known disputes', 'Dispute pending - Case #123'
    dispute_details: Optional[str] = Field(None, example="Checked local court records and owner statement.")
    dispute_data_source: Optional[str] = Field(None, example="ManualBankerEntry - Court Portal")
    dispute_source_url_or_ref: Optional[str] = Field(None, example="courtportal.gov/case/123")

    # Construction Permit
    construction_permit_status: Optional[str] = Field(None, example="Valid") # E.g., 'Valid', 'Expired', 'Not Required', 'Unknown'
    construction_permit_number: Optional[str] = Field(None, example="GPXD-12345")
    construction_permit_date: Optional[date] = Field(None, example="2020-01-15")
    permit_data_source: Optional[str] = Field(None, example="ManualBankerEntry - Construction Dept.")
    permit_source_url_or_ref: Optional[str] = Field(None, example="Construction Dept. Record #ABC")

class LegalInformationCreate(LegalInformationBase):
    property_id: int # Required when creating

class LegalInformationUpdate(LegalInformationBase):
    # All fields are optional on update, property_id is not updatable via this schema
    pass

class LegalInformationInDB(LegalInformationBase):
    legal_info_id: int
    property_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LegalInformationPublic(LegalInformationInDB):
    pass
```
