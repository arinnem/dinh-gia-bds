import psycopg2
import re
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging with UTF-8 encoding
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('admin_units_population.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'dinh_gia_bds'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password')
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        raise

def parse_new_structure_file(file_path):
    """Parse new structure file and extract provinces and wards"""
    provinces = []
    wards = []
    current_province_code = None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract provinces
    province_pattern = r'(\d+): ([^(]+) \(([^)]+)\)'
    province_matches = re.findall(province_pattern, content)
    
    for code, name, type_name in province_matches:
        provinces.append({
            'code': code.strip(),
            'name': name.strip(),
            'type': type_name.strip()
        })
    
    # Extract wards for each province
    ward_sections = re.findall(r'=== NEW WARDS FOR ([^=]+) ===([^=]+?)(?==== NEW WARDS FOR|$)', content, re.DOTALL)
    
    for province_name, ward_content in ward_sections:
        province_name = province_name.strip()
        
        # Find province code for this province
        province_code = None
        for prov in provinces:
            if prov['name'] == province_name:
                province_code = prov['code']
                break
        
        if not province_code:
            logger.warning(f"Could not find province code for {province_name}")
            continue
        
        # Extract wards
        ward_pattern = r'(\d+): ([^(]+) \(([^)]+)\)'
        ward_matches = re.findall(ward_pattern, ward_content)
        
        for ward_code, ward_name, ward_type in ward_matches:
            wards.append({
                'code': ward_code.strip(),
                'name': ward_name.strip(),
                'type': ward_type.strip(),
                'province_code': province_code
            })
    
    return provinces, wards

def parse_old_structure_file(file_path):
    """Parse old structure file and extract provinces, districts, and wards"""
    provinces = []
    districts = []
    wards = []
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract provinces
    province_pattern = r'(\d+): ([^(]+) \(([^)]+)\)'
    province_section = re.search(r'=== OLD PROVINCES ===([^=]+?)(?==== DISTRICTS FOR|$)', content, re.DOTALL)
    
    if province_section:
        province_matches = re.findall(province_pattern, province_section.group(1))
        for code, name, type_name in province_matches:
            provinces.append({
                'code': code.strip(),
                'name': name.strip(),
                'type': type_name.strip()
            })
    
    # Extract districts for each province
    district_sections = re.findall(r'=== DISTRICTS FOR ([^=]+) ===([^=]+?)(?==== WARDS FOR|=== DISTRICTS FOR|$)', content, re.DOTALL)
    
    for province_name, district_content in district_sections:
        province_name = province_name.strip()
        
        # Find province code
        province_code = None
        for prov in provinces:
            if prov['name'] == province_name:
                province_code = prov['code']
                break
        
        if not province_code:
            logger.warning(f"Could not find province code for {province_name}")
            continue
        
        # Extract districts
        district_pattern = r'(\d+): ([^(]+) \(([^)]+)\)'
        district_matches = re.findall(district_pattern, district_content)
        
        for district_code, district_name, district_type in district_matches:
            districts.append({
                'code': district_code.strip(),
                'name': district_name.strip(),
                'type': district_type.strip(),
                'province_code': province_code
            })
    
    # Extract wards for each district
    ward_sections = re.findall(r'=== WARDS FOR ([^(]+) \((\d+)\) IN ([^=]+) ===([^=]+?)(?==== WARDS FOR|=== DISTRICTS FOR|$)', content, re.DOTALL)
    
    for district_name, district_code, province_name, ward_content in ward_sections:
        district_code = district_code.strip()
        
        # Extract wards
        ward_pattern = r'(\d+): ([^(]+) \(([^)]+)\)'
        ward_matches = re.findall(ward_pattern, ward_content)
        
        for ward_code, ward_name, ward_type in ward_matches:
            wards.append({
                'code': ward_code.strip(),
                'name': ward_name.strip(),
                'type': ward_type.strip(),
                'district_code': district_code
            })
    
    return provinces, districts, wards

def insert_new_structure_data(conn, provinces, wards):
    """Insert new structure data into provinces_new and wards_new tables"""
    cursor = conn.cursor()
    
    try:
        # Clear existing data
        cursor.execute("DELETE FROM wards_new")
        cursor.execute("DELETE FROM provinces_new")
        
        # Insert provinces
        province_insert_query = """
            INSERT INTO provinces_new (code, name, type) 
            VALUES (%s, %s, %s)
            ON CONFLICT (code) DO NOTHING
            RETURNING id, code
        """
        
        province_id_map = {}
        for province in provinces:
            try:
                cursor.execute(province_insert_query, (
                    province['code'],
                    province['name'],
                    province['type']
                ))
                result = cursor.fetchone()
                if result:
                    province_id_map[province['code']] = result[0]
                    logger.info(f"Inserted new province: {province['name']} (Code: {province['code']})")
                else:
                    # Province already exists, get its ID
                    cursor.execute("SELECT id FROM provinces_new WHERE code = %s", (province['code'],))
                    result = cursor.fetchone()
                    if result:
                        province_id_map[province['code']] = result[0]
                        logger.info(f"Province {province['name']} (Code: {province['code']}) already exists")
                conn.commit()
            except Exception as e:
                conn.rollback()
                if "duplicate key value violates unique constraint" in str(e):
                    logger.warning(f"Skipping duplicate province: {province['name']} (Code: {province['code']})")
                    # Try to get the existing province ID
                    try:
                        cursor.execute("SELECT id FROM provinces_new WHERE name = %s OR code = %s", 
                                     (province['name'], province['code']))
                        result = cursor.fetchone()
                        if result:
                            province_id_map[province['code']] = result[0]
                        conn.commit()
                    except Exception as e2:
                        conn.rollback()
                        logger.error(f"Error getting existing province ID: {e2}")
                else:
                    raise
        
        # Insert wards
        ward_insert_query = """
            INSERT INTO wards_new (code, name, type, province_id) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (code) DO NOTHING
        """
        
        ward_count = 0
        for ward in wards:
            if ward['province_code'] in province_id_map:
                cursor.execute(ward_insert_query, (
                    ward['code'],
                    ward['name'],
                    ward['type'],
                    province_id_map[ward['province_code']]
                ))
                ward_count += 1
            else:
                logger.warning(f"Province code {ward['province_code']} not found for ward {ward['name']}")
        
        conn.commit()
        logger.info(f"Successfully inserted {len(provinces)} new provinces and {ward_count} new wards")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error inserting new structure data: {e}")
        raise
    finally:
        cursor.close()

def insert_old_structure_data(conn, provinces, districts, wards):
    """Insert old structure data into provinces, districts, and wards tables"""
    cursor = conn.cursor()
    
    try:
        # Clear existing data
        cursor.execute("DELETE FROM wards")
        cursor.execute("DELETE FROM districts")
        cursor.execute("DELETE FROM provinces")
        
        # Insert provinces
        province_insert_query = """
            INSERT INTO provinces (code, name, type) 
            VALUES (%s, %s, %s)
            ON CONFLICT (code) DO NOTHING
            RETURNING id, code
        """
        
        province_id_map = {}
        for province in provinces:
            try:
                cursor.execute(province_insert_query, (
                    province['code'],
                    province['name'],
                    province['type']
                ))
                result = cursor.fetchone()
                if result:
                    province_id_map[province['code']] = result[0]
                    logger.info(f"Inserted old province: {province['name']} (Code: {province['code']})")
                else:
                    # Province already exists, get its ID
                    cursor.execute("SELECT id FROM provinces WHERE code = %s", (province['code'],))
                    result = cursor.fetchone()
                    if result:
                        province_id_map[province['code']] = result[0]
                        logger.info(f"Province {province['name']} (Code: {province['code']}) already exists")
                conn.commit()
            except Exception as e:
                conn.rollback()
                if "duplicate key value violates unique constraint" in str(e):
                    logger.warning(f"Skipping duplicate province: {province['name']} (Code: {province['code']})")
                    # Try to get the existing province ID
                    try:
                        cursor.execute("SELECT id FROM provinces WHERE name = %s OR code = %s", 
                                     (province['name'], province['code']))
                        result = cursor.fetchone()
                        if result:
                            province_id_map[province['code']] = result[0]
                        conn.commit()
                    except Exception as e2:
                        conn.rollback()
                        logger.error(f"Error getting existing province ID: {e2}")
                else:
                    raise
        
        # Insert districts
        district_insert_query = """
            INSERT INTO districts (code, name, type, province_id) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (code) DO NOTHING
            RETURNING id, code
        """
        
        district_id_map = {}
        district_count = 0
        for district in districts:
            if district['province_code'] in province_id_map:
                cursor.execute(district_insert_query, (
                    district['code'],
                    district['name'],
                    district['type'],
                    province_id_map[district['province_code']]
                ))
                result = cursor.fetchone()
                district_id_map[district['code']] = result[0]
                district_count += 1
            else:
                logger.warning(f"Province code {district['province_code']} not found for district {district['name']}")
        
        # Insert wards
        ward_insert_query = """
            INSERT INTO wards (code, name, type, district_id) 
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (code) DO NOTHING
            RETURNING id, code
        """
        
        ward_count = 0
        for ward in wards:
            if ward['district_code'] in district_id_map:
                cursor.execute(ward_insert_query, (
                    ward['code'],
                    ward['name'],
                    ward['type'],
                    district_id_map[ward['district_code']]
                ))
                result = cursor.fetchone()
                ward_count += 1
            else:
                logger.warning(f"District code {ward['district_code']} not found for ward {ward['name']}")
        
        conn.commit()
        logger.info(f"Successfully inserted {len(provinces)} old provinces, {district_count} districts, and {ward_count} wards")
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Error inserting old structure data: {e}")
        raise
    finally:
        cursor.close()

def main():
    """Main function to populate database from text files"""
    logger.info("Starting administrative units population from text files")
    
    # File paths
    new_structure_file = 'd:/Works/Coding/Codebase/dinh-gia-bds/scripts/new_province_structure.txt'
    old_structure_file = 'd:/Works/Coding/Codebase/dinh-gia-bds/scripts/old_province_structure.txt'
    
    # Check if files exist
    if not os.path.exists(new_structure_file):
        logger.error(f"New structure file not found: {new_structure_file}")
        return
    
    if not os.path.exists(old_structure_file):
        logger.error(f"Old structure file not found: {old_structure_file}")
        return
    
    try:
        # Parse files
        logger.info("Parsing new structure file...")
        new_provinces, new_wards = parse_new_structure_file(new_structure_file)
        logger.info(f"Parsed {len(new_provinces)} new provinces and {len(new_wards)} new wards")
        
        logger.info("Parsing old structure file...")
        old_provinces, old_districts, old_wards = parse_old_structure_file(old_structure_file)
        logger.info(f"Parsed {len(old_provinces)} old provinces, {len(old_districts)} districts, and {len(old_wards)} wards")
        
        # Get database connection
        conn = get_db_connection()
        
        # Insert data
        logger.info("Inserting new structure data...")
        insert_new_structure_data(conn, new_provinces, new_wards)
        
        logger.info("Inserting old structure data...")
        insert_old_structure_data(conn, old_provinces, old_districts, old_wards)
        
        conn.close()
        logger.info("Administrative units population completed successfully!")
        
    except Exception as e:
        logger.error(f"Error in main execution: {e}")
        raise

if __name__ == "__main__":
    main()