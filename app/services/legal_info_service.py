from typing import Optional
from app.db.database import database
from app.schemas.legal_info_schemas import LegalInformationCreate, LegalInformationUpdate, LegalInformationInDB
from datetime import datetime
from psycopg2 import IntegrityError # For handling unique constraint on property_id

class LegalInformationService:
    async def create_or_update_legal_info(
        self, property_id: int, legal_data: LegalInformationCreate # Using Create schema for all fields initially
    ) -> Optional[LegalInformationInDB]:
        """
        Creates new legal information for a property or updates it if it already exists.
        LegalInformation has a UNIQUE constraint on property_id.
        """
        now = datetime.utcnow()

        # Check if legal info for this property_id already exists
        existing_query = "SELECT * FROM LegalInformation WHERE property_id = :property_id"
        existing_record = await database.fetch_one(query=existing_query, values={"property_id": property_id})

        if existing_record:
            # Update existing record
            update_data_dict = legal_data.model_dump(exclude_unset=True) # Get only provided fields
            if not update_data_dict: # no actual data to update, only property_id came perhaps
                 return LegalInformationInDB(**existing_record)


            update_fields = {key: value for key, value in update_data_dict.items() if key != "property_id"} # exclude property_id from SET
            if not update_fields: # no actual data to update
                 return LegalInformationInDB(**existing_record)

            # update_fields["updated_at"] = now # Trigger will handle this

            set_clauses = [f"{key} = :{key}" for key in update_fields.keys()]
            values = {"property_id": property_id, **update_fields}

            update_query = f"""
                UPDATE LegalInformation
                SET {", ".join(set_clauses)}
                WHERE property_id = :property_id
                RETURNING *;
            """
            updated_record = await database.fetch_one(query=update_query, values=values)
            if updated_record:
                return LegalInformationInDB(**updated_record)
            return None # Should ideally not happen if existing_record was found
        else:
            # Create new record
            insert_query = """
                INSERT INTO LegalInformation (
                    property_id,
                    zoning_classification, zoning_master_plan_ref, zoning_notes, zoning_data_source, zoning_source_url_or_ref,
                    dispute_status_summary, dispute_details, dispute_data_source, dispute_source_url_or_ref,
                    construction_permit_status, construction_permit_number, construction_permit_date, permit_data_source, permit_source_url_or_ref,
                    created_at, updated_at
                ) VALUES (
                    :property_id,
                    :zoning_classification, :zoning_master_plan_ref, :zoning_notes, :zoning_data_source, :zoning_source_url_or_ref,
                    :dispute_status_summary, :dispute_details, :dispute_data_source, :dispute_source_url_or_ref,
                    :construction_permit_status, :construction_permit_number, :construction_permit_date, :permit_data_source, :permit_source_url_or_ref,
                    :created_at, :updated_at
                ) RETURNING *;
            """
            values = legal_data.model_dump()
            values["created_at"] = now
            values["updated_at"] = now # Also set on create

            try:
                created_record = await database.fetch_one(query=insert_query, values=values)
                if created_record:
                    return LegalInformationInDB(**created_record)
            except IntegrityError as e:
                # This might happen in a race condition if another request created it just now.
                # Or if property_id doesn't exist in Properties table (FK constraint)
                print(f"Integrity error creating legal info: {e}")
                # Optionally, re-fetch to see if it was the race condition for unique property_id
                existing_record_after_error = await database.fetch_one(query=existing_query, values={"property_id": property_id})
                if existing_record_after_error:
                    return LegalInformationInDB(**existing_record_after_error) # Return if created by another request
                return None
            return None


    async def get_legal_info_by_property_id(self, property_id: int) -> Optional[LegalInformationInDB]:
        query = "SELECT * FROM LegalInformation WHERE property_id = :property_id"
        record = await database.fetch_one(query=query, values={"property_id": property_id})
        if record:
            return LegalInformationInDB(**record)
        return None

    async def delete_legal_info_by_property_id(self, property_id: int) -> bool:
        existing = await self.get_legal_info_by_property_id(property_id)
        if not existing:
            return False # Not found

        query = "DELETE FROM LegalInformation WHERE property_id = :property_id"
        await database.execute(query=query, values={"property_id": property_id})
        return True

```
