from typing import List, Optional, Dict, Any
from app.db.database import database
from app.schemas.property_schemas import PropertyCreate, PropertyUpdate, PropertyInDB
from datetime import datetime
from psycopg2 import IntegrityError # For handling unique constraint violations

class PropertyService:
    async def create_property(self, property_data: PropertyCreate) -> PropertyInDB:
        """
        Creates a new property record.
        If a property with the same listing_url already exists, it attempts to update it.
        This is a simple way to handle potential duplicate entries from scrapers.
        A more sophisticated approach might involve checking multiple fields or using a confidence score.
        """
        now = datetime.utcnow()

        # If listing_url is provided, check if it already exists
        if property_data.listing_url:
            existing_property_query = "SELECT * FROM Properties WHERE listing_url = :listing_url"
            existing_record = await database.fetch_one(query=existing_property_query, values={"listing_url": str(property_data.listing_url)})

            if existing_record:
                # Property with this listing_url exists, update it instead
                # Convert PropertyCreate to PropertyUpdate - take all fields from property_data
                update_data_dict = property_data.model_dump(exclude_unset=False) # include all fields
                # We need property_id for update, which is in existing_record
                return await self.update_property(
                    property_id=existing_record["property_id"],
                    property_update_data=PropertyUpdate(**update_data_dict),
                    is_scraper_update=True # Indicate this is an update from a scraper
                )

        # If no existing record by listing_url or no listing_url provided, create new
        insert_query = """
            INSERT INTO Properties (
                address_full, address_city, address_district, address_ward,
                latitude, longitude, property_type, land_area_sqm, floor_area_sqm,
                num_storeys, num_bedrooms, num_bathrooms, year_built, description,
                listing_url, listing_price, listing_price_currency, data_source_listing,
                scraped_at, created_at, updated_at
            ) VALUES (
                :address_full, :address_city, :address_district, :address_ward,
                :latitude, :longitude, :property_type, :land_area_sqm, :floor_area_sqm,
                :num_storeys, :num_bedrooms, :num_bathrooms, :year_built, :description,
                :listing_url, :listing_price, :listing_price_currency, :data_source_listing,
                :scraped_at, :created_at, :updated_at
            ) RETURNING property_id, created_at, updated_at;
        """
        values = property_data.model_dump()
        values["listing_url"] = str(values["listing_url"]) if values["listing_url"] else None # Ensure HttpUrl is string
        values["created_at"] = now
        values["updated_at"] = now
        values["scraped_at"] = values.get("scraped_at", now) if "scraper" in values.get("data_source_listing", "").lower() else None


        created_record_props = await database.fetch_one(query=insert_query, values=values)

        return PropertyInDB(
            **property_data.model_dump(),
            property_id=created_record_props["property_id"],
            created_at=created_record_props["created_at"],
            updated_at=created_record_props["updated_at"]
        )

    async def get_property_by_id(self, property_id: int) -> Optional[PropertyInDB]:
        query = "SELECT * FROM Properties WHERE property_id = :property_id"
        record = await database.fetch_one(query=query, values={"property_id": property_id})
        if record:
            return PropertyInDB(**record)
        return None

    async def get_properties(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[PropertyInDB]:
        # Basic query, can be expanded with filters (similar to HistoricalSaleService)
        base_query = "SELECT * FROM Properties"
        filter_clauses = []
        query_values = {"limit": limit, "skip": skip}

        if filters:
            for key, value in filters.items():
                if value is not None:
                    # Example: if key is 'address_city', clause is 'address_city = :address_city'
                    # For text search, you might use 'ILIKE'
                    if isinstance(value, str) and key in ["address_full", "address_city", "address_district", "description"]:
                         filter_clauses.append(f"LOWER({key}) LIKE LOWER(:{key})")
                         query_values[key] = f"%{value}%"
                    else:
                        filter_clauses.append(f"{key} = :{key}")
                        query_values[key] = value

        if filter_clauses:
            base_query += " WHERE " + " AND ".join(filter_clauses)

        final_query = f"{base_query} ORDER BY updated_at DESC, property_id DESC LIMIT :limit OFFSET :skip"

        records = await database.fetch_all(query=final_query, values=query_values)
        return [PropertyInDB(**record) for record in records]

    async def get_properties_count(
        self,
        filters: Optional[Dict[str, Any]] = None
    ) -> int:
        base_query = "SELECT COUNT(*) FROM Properties"
        filter_clauses = []
        query_values = {}
        if filters:
            for key, value in filters.items():
                if value is not None:
                    if isinstance(value, str) and key in ["address_full", "address_city", "address_district", "description"]:
                         filter_clauses.append(f"LOWER({key}) LIKE LOWER(:{key})")
                         query_values[key] = f"%{value}%"
                    else:
                        filter_clauses.append(f"{key} = :{key}")
                        query_values[key] = value

        if filter_clauses:
            base_query += " WHERE " + " AND ".join(filter_clauses)

        count_record = await database.fetch_one(query=base_query, values=query_values)
        return count_record[0] if count_record else 0

    async def update_property(
        self, property_id: int, property_update_data: PropertyUpdate, is_scraper_update: bool = False
    ) -> Optional[PropertyInDB]:
        current_property = await self.get_property_by_id(property_id)
        if not current_property:
            return None

        update_data = property_update_data.model_dump(exclude_unset=True)
        if not update_data:
            return current_property # No actual changes

        # If this update is from a scraper, update scraped_at
        if is_scraper_update or "scraper" in update_data.get("data_source_listing","").lower() :
            update_data["scraped_at"] = datetime.utcnow()

        # Ensure listing_url is string if present
        if "listing_url" in update_data and update_data["listing_url"] is not None:
            update_data["listing_url"] = str(update_data["listing_url"])

        # Always update 'updated_at' - handled by trigger, but good to be explicit if not using trigger
        # update_data["updated_at"] = datetime.utcnow() # Trigger handles this

        set_clauses = [f"{key} = :{key}" for key in update_data.keys()]
        values = {"property_id": property_id, **update_data}

        set_query_part = ", ".join(set_clauses)

        query = f"""
            UPDATE Properties
            SET {set_query_part}
            WHERE property_id = :property_id
            RETURNING *;
        """
        try:
            updated_record = await database.fetch_one(query=query, values=values)
            if updated_record:
                return PropertyInDB(**updated_record)
        except IntegrityError as e: # Catch potential unique constraint violation on listing_url if it's changed to an existing one
            print(f"Integrity error during property update: {e}")
            # Depending on policy, you might raise an HTTP exception here or handle differently
            return None
        return None

    async def delete_property(self, property_id: int) -> bool:
        current_property = await self.get_property_by_id(property_id)
        if not current_property:
            return False

        # Related records in other tables with ON DELETE CASCADE will be handled by PostgreSQL
        query = "DELETE FROM Properties WHERE property_id = :property_id"
        await database.execute(query=query, values={"property_id": property_id})
        return True

    async def suggest_comparables(
        self,
        property_id: int,
        max_distance_km: float = 5.0, # Default search radius
        date_window_months: int = 6, # Default lookback period for sales
        area_tolerance_percent: float = 0.20, # +/- 20% area tolerance
        max_results: int = 5
    ) -> List[Dict]: # Returning list of dicts, can be converted to HistoricalSalePublic schema in API layer
        """
        Suggests comparable historical sales for a given subject property.
        Note: For efficient spatial queries, PostGIS extension in PostgreSQL is recommended.
        This implementation will use Haversine for simplicity if lat/long are present,
        otherwise it will be a non-spatial filter.
        """
        subject_property = await self.get_property_by_id(property_id)
        if not subject_property:
            return []

        # Base query
        query_parts = ["SELECT *, "]
        query_values = {}

        # Haversine formula for distance calculation if lat/long are available
        # (6371 for Earth radius in km)
        if subject_property.latitude is not None and subject_property.longitude is not None:
            query_parts.append(
                """
                (6371 * acos(
                    cos(radians(:subject_lat)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:subject_lon)) +
                    sin(radians(:subject_lat)) * sin(radians(latitude))
                )) AS distance_km
                FROM HistoricalSales
                WHERE property_type = :property_type
                  AND sale_id != :exclude_sale_id_if_subject_is_a_historical_sale -- Placeholder logic
                  AND sale_date >= NOW() - INTERVAL ':date_window_months months'
                """
            )
            query_values["subject_lat"] = subject_property.latitude
            query_values["subject_lon"] = subject_property.longitude
            query_values["property_type"] = subject_property.property_type # Match property type
            query_values["exclude_sale_id_if_subject_is_a_historical_sale"] = -1 # Avoid comparing to itself if it were a sale
            query_values["date_window_months"] = date_window_months

            # Area filtering (if available on subject property)
            if subject_property.floor_area_sqm:
                min_area = subject_property.floor_area_sqm * (1 - area_tolerance_percent)
                max_area = subject_property.floor_area_sqm * (1 + area_tolerance_percent)
                query_parts.append("AND floor_area_sqm BETWEEN :min_area AND :max_area")
                query_values["min_area"] = min_area
                query_values["max_area"] = max_area
            elif subject_property.land_area_sqm: # Fallback to land_area_sqm if floor_area_sqm not present
                min_area = subject_property.land_area_sqm * (1 - area_tolerance_percent)
                max_area = subject_property.land_area_sqm * (1 + area_tolerance_percent)
                query_parts.append("AND land_area_sqm BETWEEN :min_area AND :max_area")
                query_values["min_area"] = min_area
                query_values["max_area"] = max_area

            query_parts.append("HAVING distance_km <= :max_distance_km") # Filter by distance after calculating
            query_values["max_distance_km"] = max_distance_km
            query_parts.append("ORDER BY distance_km ASC, sale_date DESC") # Order by distance, then recency
        else:
            # Non-spatial fallback: filter by city/district if available, and other attributes
            # This part needs more refinement if lat/long isn't consistently available
            query_parts.append(
                """
                * FROM HistoricalSales
                WHERE property_type = :property_type
                  AND sale_date >= NOW() - INTERVAL ':date_window_months months'
                """
            )
            query_values["property_type"] = subject_property.property_type
            query_values["date_window_months"] = date_window_months
            if subject_property.address_district:
                query_parts.append("AND address_district = :address_district")
                query_values["address_district"] = subject_property.address_district
            if subject_property.address_city:
                 query_parts.append("AND address_city = :address_city")
                 query_values["address_city"] = subject_property.address_city

            # Area filtering
            if subject_property.floor_area_sqm:
                min_area = subject_property.floor_area_sqm * (1 - area_tolerance_percent)
                max_area = subject_property.floor_area_sqm * (1 + area_tolerance_percent)
                query_parts.append("AND floor_area_sqm BETWEEN :min_area AND :max_area")
                query_values["min_area"] = min_area
                query_values["max_area"] = max_area
            elif subject_property.land_area_sqm:
                min_area = subject_property.land_area_sqm * (1 - area_tolerance_percent)
                max_area = subject_property.land_area_sqm * (1 + area_tolerance_percent)
                query_parts.append("AND land_area_sqm BETWEEN :min_area AND :max_area")
                query_values["min_area"] = min_area
                query_values["max_area"] = max_area

            query_parts.append("ORDER BY sale_date DESC") # Order by recency

        query_parts.append("LIMIT :max_results")
        query_values["max_results"] = max_results

        full_query = " ".join(query_parts)

        # print(f"Suggest Comps Query: {full_query}") # For debugging
        # print(f"Suggest Comps Values: {query_values}")

        suggested_records = await database.fetch_all(query=full_query, values=query_values)
        return [dict(record) for record in suggested_records] # Convert to list of dicts
```
