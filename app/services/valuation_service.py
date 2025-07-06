from typing import List, Optional, Dict, Any
from app.db.database import database
from app.schemas.valuation_schemas import (
    PropertyValuationCreate,
    PropertyValuationUpdate,
    PropertyValuationInDB,
    PropertyValuationWithCompsPublic,
    ValuationCompCreate,
    ValuationCompInDB,
    ValuationCompPublic
)
from app.schemas.historical_sale_schemas import HistoricalSaleInDB # For enriching ValuationCompPublic
from datetime import datetime

class ValuationService:
    # --- PropertyValuation Methods ---

    async def create_valuation(self, valuation_data: PropertyValuationCreate) -> PropertyValuationInDB:
        query = """
            INSERT INTO PropertyValuations (
                property_id, valuation_date, avm_estimated_value, banker_adjusted_value,
                valuation_currency, valuation_notes, created_at, updated_at
            ) VALUES (
                :property_id, :valuation_date, :avm_estimated_value, :banker_adjusted_value,
                :valuation_currency, :valuation_notes, :created_at, :updated_at
            ) RETURNING valuation_id, property_id, created_at, updated_at;
        """
        # Note: RETURNING * would be simpler if all fields are needed directly
        now = datetime.utcnow()
        values = valuation_data.model_dump()
        values["created_at"] = now
        values["updated_at"] = now

        created_record = await database.fetch_one(query=query, values=values)

        return PropertyValuationInDB(
            **valuation_data.model_dump(), # original data
            valuation_id=created_record["valuation_id"],
            # property_id=created_record["property_id"], # already in valuation_data
            created_at=created_record["created_at"],
            updated_at=created_record["updated_at"]
        )

    async def get_valuation_by_id(self, valuation_id: int) -> Optional[PropertyValuationInDB]:
        query = "SELECT * FROM PropertyValuations WHERE valuation_id = :valuation_id"
        record = await database.fetch_one(query=query, values={"valuation_id": valuation_id})
        if record:
            return PropertyValuationInDB(**record)
        return None

    async def get_valuations_for_property(
        self, property_id: int, skip: int = 0, limit: int = 100
    ) -> List[PropertyValuationInDB]:
        query = """
            SELECT * FROM PropertyValuations
            WHERE property_id = :property_id
            ORDER BY valuation_date DESC, valuation_id DESC
            LIMIT :limit OFFSET :skip
        """
        records = await database.fetch_all(query=query, values={"property_id": property_id, "limit": limit, "skip": skip})
        return [PropertyValuationInDB(**record) for record in records]

    async def get_valuations_for_property_count(self, property_id: int) -> int:
        query = "SELECT COUNT(*) FROM PropertyValuations WHERE property_id = :property_id"
        count_record = await database.fetch_one(query=query, values={"property_id": property_id})
        return count_record[0] if count_record else 0

    async def update_valuation(
        self, valuation_id: int, valuation_update_data: PropertyValuationUpdate
    ) -> Optional[PropertyValuationInDB]:
        current_valuation = await self.get_valuation_by_id(valuation_id)
        if not current_valuation:
            return None

        update_data = valuation_update_data.model_dump(exclude_unset=True)
        if not update_data:
            return current_valuation

        # update_data["updated_at"] = datetime.utcnow() # Trigger handles this

        set_clauses = [f"{key} = :{key}" for key in update_data.keys()]
        values = {"valuation_id": valuation_id, **update_data}

        query = f"""
            UPDATE PropertyValuations
            SET {", ".join(set_clauses)}
            WHERE valuation_id = :valuation_id
            RETURNING *;
        """
        updated_record = await database.fetch_one(query=query, values=values)
        if updated_record:
            return PropertyValuationInDB(**updated_record)
        return None

    async def delete_valuation(self, valuation_id: int) -> bool:
        # CASCADE delete on ValuationComps should handle related comps
        existing = await self.get_valuation_by_id(valuation_id)
        if not existing:
            return False

        query = "DELETE FROM PropertyValuations WHERE valuation_id = :valuation_id"
        await database.execute(query=query, values={"valuation_id": valuation_id})
        return True

    # --- ValuationComp Methods ---

    async def add_comp_to_valuation(
        self, valuation_id: int, comp_data: ValuationCompCreate
    ) -> Optional[ValuationCompInDB]:
        # Check if valuation exists
        valuation = await self.get_valuation_by_id(valuation_id)
        if not valuation:
            # Or raise HTTPException here to be caught by API layer
            return None

        # Check if historical sale exists (optional, FK constraint will catch it too)
        # from app.services.historical_sale_service import HistoricalSaleService # Avoid circular import if possible
        # hs_service = HistoricalSaleService()
        # if not await hs_service.get_historical_sale_by_id(comp_data.historical_sale_id):
        #     return None # Historical sale not found

        query = """
            INSERT INTO ValuationComps (
                valuation_id, historical_sale_id, is_auto_suggested, selection_rationale
            ) VALUES (
                :valuation_id, :historical_sale_id, :is_auto_suggested, :selection_rationale
            ) RETURNING valuation_comp_id;
        """
        values = {
            "valuation_id": valuation_id,
            **comp_data.model_dump()
        }
        try:
            created_comp_props = await database.fetch_one(query=query, values=values)
            if created_comp_props:
                 return ValuationCompInDB(
                    valuation_comp_id=created_comp_props["valuation_comp_id"],
                    valuation_id=valuation_id,
                    **comp_data.model_dump()
                )
        except Exception as e: # Catch potential IntegrityError for duplicate (valuation_id, historical_sale_id) or FK violation
            print(f"Error adding comp to valuation: {e}")
            return None
        return None


    async def get_comps_for_valuation(self, valuation_id: int) -> List[ValuationCompPublic]:
        # This query joins with HistoricalSales to enrich the comp data
        query = """
            SELECT
                vc.valuation_comp_id, vc.valuation_id, vc.historical_sale_id,
                vc.is_auto_suggested, vc.selection_rationale,
                hs.sale_id as hs_sale_id, hs.address_full as hs_address_full, hs.sale_date as hs_sale_date,
                hs.sale_price as hs_sale_price, hs.sale_price_currency as hs_sale_price_currency,
                hs.property_type as hs_property_type, hs.land_area_sqm as hs_land_area_sqm,
                hs.floor_area_sqm as hs_floor_area_sqm, hs.year_built as hs_year_built,
                hs.data_source as hs_data_source, hs.source_details_url_or_ref as hs_source_details_url_or_ref,
                hs.is_verified_by_banker as hs_is_verified_by_banker, hs.banker_notes as hs_banker_notes,
                hs.created_at as hs_created_at, hs.updated_at as hs_updated_at
            FROM ValuationComps vc
            JOIN HistoricalSales hs ON vc.historical_sale_id = hs.sale_id
            WHERE vc.valuation_id = :valuation_id;
        """
        records = await database.fetch_all(query=query, values={"valuation_id": valuation_id})

        results = []
        for record in records:
            hs_data = {
                "sale_id": record["hs_sale_id"],
                "address_full": record["hs_address_full"],
                # ... map all other hs_ fields ...
                "sale_date": record["hs_sale_date"],
                "sale_price": record["hs_sale_price"],
                "sale_price_currency": record["hs_sale_price_currency"],
                "property_type": record["hs_property_type"],
                "land_area_sqm": record["hs_land_area_sqm"],
                "floor_area_sqm": record["hs_floor_area_sqm"],
                "year_built": record["hs_year_built"],
                "data_source": record["hs_data_source"],
                "source_details_url_or_ref": record["hs_source_details_url_or_ref"],
                "is_verified_by_banker": record["hs_is_verified_by_banker"],
                "banker_notes": record["hs_banker_notes"],
                "created_at": record["hs_created_at"],
                "updated_at": record["hs_updated_at"],
            }
            comp_public = ValuationCompPublic(
                valuation_comp_id=record["valuation_comp_id"],
                valuation_id=record["valuation_id"],
                historical_sale_id=record["historical_sale_id"],
                is_auto_suggested=record["is_auto_suggested"],
                selection_rationale=record["selection_rationale"],
                historical_sale=HistoricalSaleInDB(**hs_data) # Use InDB or Public schema
            )
            results.append(comp_public)
        return results

    async def remove_comp_from_valuation(self, valuation_id: int, historical_sale_id: int) -> bool:
        query = """
            DELETE FROM ValuationComps
            WHERE valuation_id = :valuation_id AND historical_sale_id = :historical_sale_id
            RETURNING valuation_comp_id;
        """
        # Using fetch_one to see if a row was actually deleted
        deleted_comp = await database.fetch_one(query=query, values={
            "valuation_id": valuation_id,
            "historical_sale_id": historical_sale_id
        })
        return deleted_comp is not None

    # Combined method to get valuation with its comps
    async def get_valuation_with_comps(self, valuation_id: int) -> Optional[PropertyValuationWithCompsPublic]:
        valuation = await self.get_valuation_by_id(valuation_id)
        if not valuation:
            return None

        comps = await self.get_comps_for_valuation(valuation_id)

        return PropertyValuationWithCompsPublic(
            **valuation.model_dump(),
            comparables=comps
        )

    async def calculate_assisted_avm(
        self,
        valuation_id: int,
        # Adjustments would likely come from the frontend, mapping comp_id to adjustment values
        # For now, let's assume this method is called after comps are selected and adjustments are known.
        # The actual adjustments would be more complex in a real UI (e.g. per feature)
        # This is a simplified placeholder for the calculation logic.
        comp_adjustments: List[Dict[str, Any]] # Expects list like [{"historical_sale_id": X, "total_adjustment_value": Y}]
    ) -> Optional[Dict[str, Any]]:
        """
        Calculates a suggested AVM value based on selected comparables and their adjustments.
        This is a simplified version for the "Sales Comparison Approach Assistant".

        Args:
            valuation_id: The ID of the valuation.
            comp_adjustments: A list of dictionaries, each containing:
                - "historical_sale_id": The ID of the comparable sale.
                - "total_adjustment_value": The net monetary adjustment applied to this comp by the banker.
                                         (Positive if comp is inferior, negative if superior for a given factor)

        Returns:
            A dictionary with 'suggested_avm_value', 'min_adjusted_price', 'max_adjusted_price',
            'average_adjusted_price', and 'adjusted_comps_details', or None if issues occur.
        """
        valuation_with_comps = await self.get_valuation_with_comps(valuation_id)
        if not valuation_with_comps or not valuation_with_comps.comparables:
            return None # No valuation or no comps to work with

        adjusted_prices = []
        adjusted_comps_details = []

        adjustments_map = {adj["historical_sale_id"]: adj["total_adjustment_value"] for adj in comp_adjustments}

        for comp_wrapper in valuation_with_comps.comparables:
            comp_detail = comp_wrapper.historical_sale
            if not comp_detail: continue # Should not happen if enrichment is done right

            adjustment_value = adjustments_map.get(comp_detail.sale_id, 0) # Default to 0 if no adjustment provided

            adjusted_price = comp_detail.sale_price + adjustment_value
            adjusted_prices.append(adjusted_price)

            adjusted_comps_details.append({
                "historical_sale_id": comp_detail.sale_id,
                "original_price": comp_detail.sale_price,
                "total_adjustment": adjustment_value,
                "adjusted_price": adjusted_price,
                "address_full": comp_detail.address_full
            })

        if not adjusted_prices:
            return {
                "suggested_avm_value": None,
                "min_adjusted_price": None,
                "max_adjusted_price": None,
                "average_adjusted_price": None,
                "adjusted_comps_details": adjusted_comps_details,
                "message": "No comparable prices were adjusted."
            }

        min_adj_price = min(adjusted_prices)
        max_adj_price = max(adjusted_prices)
        avg_adj_price = sum(adjusted_prices) / len(adjusted_prices)

        # Simple AVM suggestion could be the average, or a weighted average if we had more factors
        suggested_avm = avg_adj_price

        # Update the valuation record with this AVM estimate
        avm_update_schema = PropertyValuationUpdate(avm_estimated_value=suggested_avm)
        await self.update_valuation(valuation_id, avm_update_schema)

        return {
            "suggested_avm_value": suggested_avm,
            "min_adjusted_price": min_adj_price,
            "max_adjusted_price": max_adj_price,
            "average_adjusted_price": avg_adj_price,
            "adjusted_comps_details": adjusted_comps_details
        }

```
