#!/usr/bin/env python3
"""
Verification script for dummy_data.sql to check Phase 1 requirements
"""

import re
import os

def count_insert_statements(file_path, table_name):
    """Count INSERT statements for a specific table"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match INSERT INTO table_name statements
    pattern = rf'INSERT INTO {table_name}\s*\([^)]+\)\s*VALUES'
    matches = re.findall(pattern, content, re.IGNORECASE)
    
    # Count individual value sets
    # Find the section for this table
    table_section_pattern = rf'INSERT INTO {table_name}\s*\([^)]+\)\s*VALUES([^;]+);'
    table_matches = re.findall(table_section_pattern, content, re.IGNORECASE | re.DOTALL)
    
    total_count = 0
    for match in table_matches:
        # Count the number of value tuples (each starts with '(')
        value_tuples = re.findall(r'\([^)]*\)', match)
        total_count += len(value_tuples)
    
    return total_count

def extract_cities_from_properties(file_path):
    """Extract unique cities from property addresses"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all property INSERT statements
    property_pattern = r'INSERT INTO properties.*?VALUES([^;]+);'
    property_matches = re.findall(property_pattern, content, re.IGNORECASE | re.DOTALL)
    
    cities = set()
    for match in property_matches:
        # Extract addresses (look for patterns like 'City Name' in addresses)
        addresses = re.findall(r"'[^']*(?:Hà Nội|Đà Nẵng|Cần Thơ|Vũng Tàu|Hải Phòng|Nha Trang|Ho Chi Minh|Sài Gòn)[^']*'", match)
        for addr in addresses:
            if 'Hà Nội' in addr or 'Hanoi' in addr:
                cities.add('Hanoi')
            elif 'Đà Nẵng' in addr or 'Da Nang' in addr:
                cities.add('Da Nang')
            elif 'Cần Thơ' in addr or 'Can Tho' in addr:
                cities.add('Can Tho')
            elif 'Vũng Tàu' in addr or 'Vung Tau' in addr:
                cities.add('Vung Tau')
            elif 'Hải Phòng' in addr or 'Hai Phong' in addr:
                cities.add('Hai Phong')
            elif 'Nha Trang' in addr:
                cities.add('Nha Trang')
            else:
                cities.add('Ho Chi Minh City')
    
    return cities

def verify_dummy_data():
    """Main verification function"""
    file_path = 'database/dummy_data.sql'
    
    if not os.path.exists(file_path):
        print(f"❌ Error: {file_path} not found")
        return False
    
    print("🔍 Verifying dummy_data.sql for Phase 1 requirements...\n")
    
    # Count different types of data
    tables_to_check = {
        'districts': 50,  # Requirement: 50+ districts
        'wards': 200,     # Requirement: 200+ wards
        'properties': 50, # Requirement: 50+ properties
        'users': 10,      # Requirement: 10+ users
        'projects': 10,   # Requirement: 10+ projects
    }
    
    results = {}
    all_passed = True
    
    for table, min_required in tables_to_check.items():
        count = count_insert_statements(file_path, table)
        results[table] = count
        status = "✅ PASS" if count >= min_required else "❌ FAIL"
        print(f"{table.capitalize()}: {count} (required: {min_required}+) {status}")
        if count < min_required:
            all_passed = False
    
    # Check geographic distribution
    print("\n🌍 Geographic Distribution:")
    cities = extract_cities_from_properties(file_path)
    print(f"Cities covered: {len(cities)} - {', '.join(sorted(cities))}")
    if len(cities) >= 5:
        print("✅ PASS - Multiple cities covered")
    else:
        print("❌ FAIL - Need at least 5 cities")
        all_passed = False
    
    # Check file structure
    print("\n📋 File Structure:")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    required_sections = [
        'property_types',
        'legal_statuses', 
        'directions',
        'districts',
        'wards',
        'users',
        'projects',
        'ml_models',
        'properties'
    ]
    
    for section in required_sections:
        if f'INSERT INTO {section}' in content:
            print(f"✅ {section} section found")
        else:
            print(f"❌ {section} section missing")
            all_passed = False
    
    # Summary
    print("\n" + "="*50)
    if all_passed:
        print("🎉 SUCCESS: All Phase 1 requirements met!")
        print(f"📊 Total properties: {results.get('properties', 0)}")
        print(f"🏙️ Cities covered: {len(cities)}")
        print(f"🏢 Districts: {results.get('districts', 0)}")
        print(f"🏘️ Wards: {results.get('wards', 0)}")
    else:
        print("❌ FAILED: Some requirements not met")
    
    return all_passed

if __name__ == '__main__':
    verify_dummy_data()