#!/usr/bin/env python3
"""
CLI Demo for Real Estate Analysis Platform - First Backend Feature
Property Search and Listing API Demo

This script demonstrates the core property management functionality:
1. Create sample properties
2. Search and filter properties
3. Retrieve property details
4. Update property information

Usage:
    python cli_demo.py --help
    python cli_demo.py create-sample-data
    python cli_demo.py search --city "Ho Chi Minh City" --property-type "HOUSE"
    python cli_demo.py get-property --id 1
    python cli_demo.py list-all --limit 5
"""

import asyncio
import argparse
import json
from typing import Optional
from datetime import datetime

# Import our application components
from app.services.property_service import PropertyService
from app.schemas.property_schemas import PropertyCreate, PropertyUpdate
from app.db.database import connect_db, disconnect_db

class PropertyCLI:
    def __init__(self):
        self.service = PropertyService()
    
    async def create_sample_data(self):
        """Create sample property data for testing"""
        print("Creating sample property data...")
        
        # Get current timestamp for scraped_at field
        current_time = datetime.utcnow()
        
        sample_properties = [
            PropertyCreate(
                address_full="123 Nguyen Hue Street, District 1, Ho Chi Minh City",
                address_city="Ho Chi Minh City",
                address_district="District 1",
                address_ward="Ben Nghe",
                latitude=10.7769,
                longitude=106.7009,
                property_type="APARTMENT",
                land_area_sqm=None,
                floor_area_sqm=85.0,
                num_storeys=1,
                num_bedrooms=2,
                num_bathrooms=2,
                year_built=2018,
                description="Modern apartment in city center with great view",
                listing_url="https://example.com/listing/1",
                listing_price=3500000000,
                listing_price_currency="VND",
                data_source_listing="manual_entry",
                scraped_at=current_time
            ),
            PropertyCreate(
                address_full="456 Le Van Sy Street, District 3, Ho Chi Minh City",
                address_city="Ho Chi Minh City",
                address_district="District 3",
                address_ward="Ward 1",
                latitude=10.7829,
                longitude=106.6890,
                property_type="HOUSE",
                land_area_sqm=120.0,
                floor_area_sqm=200.0,
                num_storeys=3,
                num_bedrooms=4,
                num_bathrooms=3,
                year_built=2015,
                description="Spacious house with garden and parking",
                listing_url="https://example.com/listing/2",
                listing_price=8500000000,
                listing_price_currency="VND",
                data_source_listing="manual_entry",
                scraped_at=current_time
            ),
            PropertyCreate(
                address_full="789 Tran Hung Dao Street, District 5, Ho Chi Minh City",
                address_city="Ho Chi Minh City",
                address_district="District 5",
                address_ward="Ward 2",
                latitude=10.7569,
                longitude=106.6819,
                property_type="VILLA",
                land_area_sqm=300.0,
                floor_area_sqm=450.0,
                num_storeys=2,
                num_bedrooms=5,
                num_bathrooms=4,
                year_built=2020,
                description="Luxury villa with swimming pool and garden",
                listing_url="https://example.com/listing/3",
                listing_price=15000000000,
                listing_price_currency="VND",
                data_source_listing="manual_entry",
                scraped_at=current_time
            ),
            PropertyCreate(
                address_full="321 Vo Van Tan Street, District 3, Ho Chi Minh City",
                address_city="Ho Chi Minh City",
                address_district="District 3",
                address_ward="Ward 5",
                latitude=10.7759,
                longitude=106.6919,
                property_type="APARTMENT",
                land_area_sqm=None,
                floor_area_sqm=65.0,
                num_storeys=1,
                num_bedrooms=1,
                num_bathrooms=1,
                year_built=2019,
                description="Cozy studio apartment near university",
                listing_url="https://example.com/listing/4",
                listing_price=2200000000,
                listing_price_currency="VND",
                data_source_listing="manual_entry",
                scraped_at=current_time
            )
        ]
        
        created_count = 0
        for prop_data in sample_properties:
            try:
                created_property = await self.service.create_property(prop_data)
                print(f"✓ Created property: {created_property.address_full} (ID: {created_property.property_id})")
                created_count += 1
            except Exception as e:
                print(f"✗ Failed to create property {prop_data.address_full}: {e}")
        
        print(f"\nSample data creation completed. Created {created_count} properties.")
    
    async def search_properties(self, city: Optional[str] = None, district: Optional[str] = None, 
                              property_type: Optional[str] = None, min_price: Optional[float] = None,
                              max_price: Optional[float] = None, limit: int = 10):
        """Search properties with filters"""
        print("Searching properties with filters:")
        
        filters = {}
        if city:
            filters["address_city"] = city
            print(f"  - City: {city}")
        if district:
            filters["address_district"] = district
            print(f"  - District: {district}")
        if property_type:
            filters["property_type"] = property_type
            print(f"  - Property Type: {property_type}")
        if min_price:
            filters["listing_price_gte"] = min_price
            print(f"  - Min Price: {min_price:,.0f} VND")
        if max_price:
            filters["listing_price_lte"] = max_price
            print(f"  - Max Price: {max_price:,.0f} VND")
        
        print(f"  - Limit: {limit}")
        print()
        
        try:
            properties = await self.service.get_properties(skip=0, limit=limit, filters=filters)
            total_count = await self.service.get_properties_count(filters=filters)
            
            print(f"Found {total_count} properties matching criteria:")
            print("=" * 80)
            
            for prop in properties:
                print(f"ID: {prop.property_id}")
                print(f"Address: {prop.address_full}")
                print(f"Type: {prop.property_type}")
                print(f"Price: {prop.listing_price:,.0f} {prop.listing_price_currency}" if prop.listing_price else "Price: Not specified")
                print(f"Area: {prop.floor_area_sqm} sqm" if prop.floor_area_sqm else "Area: Not specified")
                print(f"Bedrooms: {prop.num_bedrooms}" if prop.num_bedrooms else "Bedrooms: Not specified")
                print(f"Description: {prop.description[:100]}..." if prop.description and len(prop.description) > 100 else f"Description: {prop.description}")
                print("-" * 40)
                
        except Exception as e:
            print(f"Error searching properties: {e}")
    
    async def get_property_by_id(self, property_id: int):
        """Get detailed information about a specific property"""
        print(f"Retrieving property with ID: {property_id}")
        
        try:
            property_data = await self.service.get_property_by_id(property_id)
            
            if not property_data:
                print(f"Property with ID {property_id} not found.")
                return
            
            print("=" * 60)
            print(f"PROPERTY DETAILS - ID: {property_data.property_id}")
            print("=" * 60)
            print(f"Address: {property_data.address_full}")
            print(f"City: {property_data.address_city}")
            print(f"District: {property_data.address_district}")
            print(f"Ward: {property_data.address_ward}")
            print(f"Property Type: {property_data.property_type}")
            print(f"Land Area: {property_data.land_area_sqm} sqm" if property_data.land_area_sqm else "Land Area: Not specified")
            print(f"Floor Area: {property_data.floor_area_sqm} sqm" if property_data.floor_area_sqm else "Floor Area: Not specified")
            print(f"Storeys: {property_data.num_storeys}" if property_data.num_storeys else "Storeys: Not specified")
            print(f"Bedrooms: {property_data.num_bedrooms}" if property_data.num_bedrooms else "Bedrooms: Not specified")
            print(f"Bathrooms: {property_data.num_bathrooms}" if property_data.num_bathrooms else "Bathrooms: Not specified")
            print(f"Year Built: {property_data.year_built}" if property_data.year_built else "Year Built: Not specified")
            print(f"Listing Price: {property_data.listing_price:,.0f} {property_data.listing_price_currency}" if property_data.listing_price else "Listing Price: Not specified")
            print(f"Data Source: {property_data.data_source_listing}")
            print(f"Listing URL: {property_data.listing_url}" if property_data.listing_url else "Listing URL: Not specified")
            print(f"Description: {property_data.description}" if property_data.description else "Description: Not specified")
            print(f"Created: {property_data.created_at}")
            print(f"Updated: {property_data.updated_at}")
            
        except Exception as e:
            print(f"Error retrieving property: {e}")
    
    async def list_all_properties(self, limit: int = 10, skip: int = 0):
        """List all properties with pagination"""
        print(f"Listing all properties (limit: {limit}, skip: {skip})")
        
        try:
            properties = await self.service.get_properties(skip=skip, limit=limit)
            total_count = await self.service.get_properties_count()
            
            print(f"\nShowing {len(properties)} of {total_count} total properties:")
            print("=" * 80)
            
            if not properties:
                print("No properties found. Try creating sample data first with: python cli_demo.py create-sample-data")
                return
            
            for prop in properties:
                print(f"[{prop.property_id}] {prop.address_full}")
                print(f"    Type: {prop.property_type} | Price: {prop.listing_price:,.0f} VND" if prop.listing_price else f"    Type: {prop.property_type} | Price: Not specified")
                print(f"    Area: {prop.floor_area_sqm} sqm | Bedrooms: {prop.num_bedrooms}" if prop.floor_area_sqm and prop.num_bedrooms else f"    Area/Bedrooms: Not fully specified")
                print()
                
        except Exception as e:
            print(f"Error listing properties: {e}")

async def main():
    parser = argparse.ArgumentParser(description="Real Estate Analysis Platform - Property Management CLI Demo")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Create sample data command
    subparsers.add_parser("create-sample-data", help="Create sample property data for testing")
    
    # Search command
    search_parser = subparsers.add_parser("search", help="Search properties with filters")
    search_parser.add_argument("--city", help="Filter by city")
    search_parser.add_argument("--district", help="Filter by district")
    search_parser.add_argument("--property-type", help="Filter by property type (APARTMENT, HOUSE, VILLA, LAND)")
    search_parser.add_argument("--min-price", type=float, help="Minimum listing price")
    search_parser.add_argument("--max-price", type=float, help="Maximum listing price")
    search_parser.add_argument("--limit", type=int, default=10, help="Maximum number of results")
    
    # Get property command
    get_parser = subparsers.add_parser("get-property", help="Get detailed information about a specific property")
    get_parser.add_argument("--id", type=int, required=True, help="Property ID")
    
    # List all command
    list_parser = subparsers.add_parser("list-all", help="List all properties")
    list_parser.add_argument("--limit", type=int, default=10, help="Maximum number of results")
    list_parser.add_argument("--skip", type=int, default=0, help="Number of records to skip")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize database connection
    print("Connecting to database...")
    try:
        await connect_db()
        print("✓ Database connected successfully")
    except Exception as e:
        print(f"✗ Failed to connect to database: {e}")
        print("\nMake sure PostgreSQL is running and the database is set up.")
        print("Run: python database_setup.py")
        return
    
    # Initialize CLI
    cli = PropertyCLI()
    
    try:
        if args.command == "create-sample-data":
            await cli.create_sample_data()
        
        elif args.command == "search":
            await cli.search_properties(
                city=args.city,
                district=args.district,
                property_type=args.property_type,
                min_price=args.min_price,
                max_price=args.max_price,
                limit=args.limit
            )
        
        elif args.command == "get-property":
            await cli.get_property_by_id(args.id)
        
        elif args.command == "list-all":
            await cli.list_all_properties(limit=args.limit, skip=args.skip)
    
    except Exception as e:
        print(f"Error executing command: {e}")
    
    finally:
        # Clean up database connection
        await disconnect_db()
        print("\nDatabase connection closed.")

if __name__ == "__main__":
    print("Real Estate Analysis Platform - Property Management CLI Demo")
    print("=" * 60)
    asyncio.run(main())