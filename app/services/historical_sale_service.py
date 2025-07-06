from typing import List, Optional, Dict, Any
from app.db.database import database # Our async database instance
from app.schemas.historical_sale_schemas import HistoricalSaleCreate, HistoricalSaleUpdate, HistoricalSaleInDB
from datetime import datetime

class HistoricalSaleService:
    async def create_historical_sale(self, sale_data: HistoricalSaleCreate) -> HistoricalSaleInDB:
        query = """
            INSERT INTO HistoricalSales (
                address_full, address_city, address_district, address_ward,
                latitude, longitude, sale_date, sale_price, sale_price_currency,
                property_type, land_area_sqm, floor_area_sqm, year_built,
                data_source, source_details_url_or_ref, is_verified_by_banker, banker_notes,
                created_at, updated_at
            ) VALUES (
                :address_full, :address_city, :address_district, :address_ward,
                :latitude, :longitude, :sale_date, :sale_price, :sale_price_currency,
                :property_type, :land_area_sqm, :floor_area_sqm, :year_built,
                :data_source, :source_details_url_or_ref, :is_verified_by_banker, :banker_notes,
                :created_at, :updated_at
            ) RETURNING sale_id, created_at, updated_at;
        """
        now = datetime.utcnow()
        values = sale_data.model_dump()
        values["created_at"] = now
        values["updated_at"] = now

        # Ensure all fields from HistoricalSaleCreate are present in values, even if None
        # Pydantic model_dump() should handle this if fields have defaults or are Optional
        # For fields not in HistoricalSaleCreate but in DB (like created_at, updated_at), we add them

        created_record = await database.fetch_one(query=query, values=values)

        # Combine original data with DB-generated fields
        # The RETURNING clause gives us sale_id, created_at, updated_at
        # We can construct the full HistoricalSaleInDB object
        return HistoricalSaleInDB(
            **sale_data.model_dump(),
            sale_id=created_record["sale_id"],
            created_at=created_record["created_at"], # Use DB's timestamp if possible
            updated_at=created_record["updated_at"]  # Use DB's timestamp
        )

    async def get_historical_sale_by_id(self, sale_id: int) -> Optional[HistoricalSaleInDB]:
        query = "SELECT * FROM HistoricalSales WHERE sale_id = :sale_id"
        record = await database.fetch_one(query=query, values={"sale_id": sale_id})
        if record:
            return HistoricalSaleInDB(**record)
        return None

    async def get_historical_sales(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None # For filtering later
    ) -> List[HistoricalSaleInDB]:
        query = "SELECT * FROM HistoricalSales ORDER BY sale_date DESC, sale_id DESC LIMIT :limit OFFSET :skip"
        # Basic query, can be expanded with filters
        # Example of adding filters (needs more robust construction):
        # filter_clauses = []
        # values = {"limit": limit, "skip": skip}
        # if filters:
        #     for key, value in filters.items():
        #         if value is not None: # Add more checks based on field type
        #             filter_clauses.append(f"{key} = :{key}") # Be careful with SQL injection if keys are not controlled
        #             values[key] = value
        # if filter_clauses:
        #     query = f"SELECT * FROM HistoricalSales WHERE {' AND '.join(filter_clauses)} ORDER BY sale_id DESC LIMIT :limit OFFSET :skip"

        records = await database.fetch_all(query=query, values={"limit": limit, "skip": skip})
        return [HistoricalSaleInDB(**record) for record in records]

    async def get_historical_sales_count(
        self,
        filters: Optional[Dict[str, Any]] = None
    ) -> int:
        query = "SELECT COUNT(*) FROM HistoricalSales"
        # Add WHERE clause if filters are applied, similar to get_historical_sales
        count_record = await database.fetch_one(query=query)
        return count_record[0] if count_record else 0


    async def update_historical_sale(
        self, sale_id: int, sale_update_data: HistoricalSaleUpdate
    ) -> Optional[HistoricalSaleInDB]:
        # Fetch current record to see what exists
        current_sale = await self.get_historical_sale_by_id(sale_id)
        if not current_sale:
            return None

        # Get data from the update model, excluding unset fields
        update_data = sale_update_data.model_dump(exclude_unset=True)

        if not update_data: # If nothing to update
            return current_sale

        update_data["updated_at"] = datetime.utcnow()

        # Construct the SET part of the query dynamically
        set_clauses = []
        values = {"sale_id": sale_id}
        for key, value in update_data.items():
            set_clauses.append(f"{key} = :{key}")
            values[key] = value

        if not set_clauses: # Should not happen if update_data is not empty
             return current_sale

        set_query_part = ", ".join(set_clauses)

        query = f"""
            UPDATE HistoricalSales
            SET {set_query_part}
            WHERE sale_id = :sale_id
            RETURNING *;
        """
        # The RETURNING * will give us all fields of the updated row
        updated_record = await database.fetch_one(query=query, values=values)

        if updated_record:
            return HistoricalSaleInDB(**updated_record)
        return None # Should not happen if current_sale existed

    async def delete_historical_sale(self, sale_id: int) -> bool:
        query = "DELETE FROM HistoricalSales WHERE sale_id = :sale_id RETURNING sale_id;"
        result = await database.execute(query=query, values={"sale_id": sale_id})
        # execute() for DELETE might return the ID or affect row count depending on backend.
        # For RETURNING, fetch_one might be better if we need the deleted id.
        # Or check if `result` (which could be the sale_id if RETURNING is used with execute like this,
        # or primary key of the deleted row with some drivers) has a value.
        # A simpler way is to just execute and assume success if no error, then confirm deletion.
        # Let's refine this:

        # Check if exists first
        current_sale = await self.get_historical_sale_by_id(sale_id)
        if not current_sale:
            return False # Not found, so can't delete

        delete_query = "DELETE FROM HistoricalSales WHERE sale_id = :sale_id"
        await database.execute(query=delete_query, values={"sale_id": sale_id})
        return True # Assume success if no exception

# Instantiate the service if you want to use it as a singleton
# historical_sale_service = HistoricalSaleService()
```
