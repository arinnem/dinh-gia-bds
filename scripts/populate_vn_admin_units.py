import psycopg2
import requests
import time
import logging
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'database': os.getenv('DB_NAME', 'dinh_gia_bds')
}

API_BASE = 'https://tinhthanhpho.com/api/v1'
RATE_LIMIT_DELAY = 0.065  # seconds between requests (1000/minute)

# Endpoints for old and new structures
ENDPOINTS = {
    'old': {
        'provinces': f'{API_BASE}/provinces',
        'districts': f'{API_BASE}/provinces/{{province_code}}/districts',
        'wards': f'{API_BASE}/districts/{{district_code}}/wards',
    },
    'new': {
        'provinces': f'{API_BASE}/new-provinces',
        'wards': f'{API_BASE}/new-provinces/{{province_code}}/wards',
    }
}

def get_json(url, retries=3):
    """Fetch JSON data from API with retry logic"""
    for attempt in range(retries):
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.warning(f"Attempt {attempt + 1} failed for {url}: {e}")
            if attempt == retries - 1:
                logger.error(f"Failed to fetch {url} after {retries} attempts")
                return None
            time.sleep(2 ** attempt)  # Exponential backoff
    return None

def fetch_all(endpoint, params=None, key='data'):
    """Fetch all paginated results from an endpoint."""
    all_data = []
    page = 1
    per_page = 100
    
    while True:
        # Construct URL with parameters
        url = f"{endpoint}?page={page}&per_page={per_page}"
        if params:
            for key, value in params.items():
                url += f"&{key}={value}"
        
        logger.info(f"Fetching page {page} from {endpoint}")
        data = get_json(url)
        
        if not data or not data.get('data'):
            break
            
        all_data.extend(data['data'])
        
        # Check if we've reached the last page
        if len(data['data']) < per_page:
            break
            
        page += 1
        time.sleep(RATE_LIMIT_DELAY)
    
    return all_data

def dump_to_file(filename, old_provinces, old_districts, old_wards, new_provinces, new_wards):
    """Write all fetched data to a text file for inspection"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write("=== VIETNAM ADMINISTRATIVE UNITS DUMP ===\n\n")
        
        f.write(f"OLD STRUCTURE:\n")
        f.write(f"Provinces: {len(old_provinces)}\n")
        f.write(f"Districts: {len(old_districts)}\n")
        f.write(f"Wards: {len(old_wards)}\n\n")
        
        f.write(f"NEW STRUCTURE:\n")
        f.write(f"Provinces: {len(new_provinces)}\n")
        f.write(f"Wards: {len(new_wards)}\n\n")
        
        f.write("=== OLD PROVINCES ===\n")
        for prov in old_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")
        
        f.write("\n=== OLD DISTRICTS ===\n")
        for dist in old_districts:
            f.write(f"{dist['code']}: {dist['name']} ({dist['type']})\n")
        
        f.write("\n=== OLD WARDS ===\n")
        for ward in old_wards:
            f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
        
        f.write("\n=== NEW PROVINCES ===\n")
        for prov in new_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")
        
        f.write("\n=== NEW WARDS ===\n")
        for ward in new_wards:
            f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
    
    logger.info(f"Data dumped to {filename}")

def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Initialize data collections
    old_provinces = []
    old_districts = []
    old_wards = []
    new_provinces = []
    new_wards = []
    
    # Initialize mapping dictionaries
    province_code_to_id = {}
    district_code_to_id = {}

    # --- OLD STRUCTURE ---
    logger.info('Fetching OLD provinces...')
    old_provinces = fetch_all(ENDPOINTS['old']['provinces'])
    logger.info(f'Fetched {len(old_provinces)} old provinces.')
    
    # Write old provinces to file immediately
    with open('vn_admin_units_dump.txt', 'w', encoding='utf-8') as f:
        f.write("=== VIETNAM ADMINISTRATIVE UNITS DUMP ===\n\n")
        f.write(f"OLD STRUCTURE:\n")
        f.write(f"Provinces: {len(old_provinces)}\n\n")
        f.write("=== OLD PROVINCES ===\n")
        for prov in old_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")

    # Insert old provinces to DB
    for prov in old_provinces:
        cur.execute(
            "INSERT INTO provinces (code, name, type) VALUES (%s, %s, %s) ON CONFLICT (code) DO UPDATE SET name=EXCLUDED.name RETURNING id",
            (prov['code'], prov['name'], prov['type'])
        )
        province_id = cur.fetchone()[0]
        province_code_to_id[prov['code']] = province_id
        conn.commit()
        time.sleep(RATE_LIMIT_DELAY)

    # For each old province, fetch districts → write to file → insert to DB
    for prov in old_provinces:
        districts = fetch_all(ENDPOINTS['old']['districts'].format(province_code=prov['code']))
        old_districts.extend(districts)
        logger.info(f"Province {prov['name']} ({prov['code']}): {len(districts)} districts")
        
        # Write districts to file
        with open('vn_admin_units_dump.txt', 'a', encoding='utf-8') as f:
            f.write(f"\n=== DISTRICTS FOR {prov['name']} ===\n")
            for dist in districts:
                f.write(f"{dist['code']}: {dist['name']} ({dist['type']})\n")
        
        # Insert districts to DB
        for dist in districts:
            # Check if district already exists by code
            cur.execute("SELECT id FROM districts WHERE code = %s", (dist['code'],))
            existing = cur.fetchone()
            
            if existing:
                # District already exists, use existing ID
                district_id = existing[0]
                logger.info(f"District {dist['name']} ({dist['code']}) already exists, using existing ID")
            else:
                cur.execute(
                    "INSERT INTO districts (code, name, type, province_id) VALUES (%s, %s, %s, %s) ON CONFLICT (code) DO NOTHING RETURNING id",
                    (dist['code'], dist['name'], dist['type'], province_code_to_id[prov['code']])
                )
                result = cur.fetchone()
                if result:
                    district_id = result[0]
                else:
                    # District with same code exists, get its ID
                    cur.execute("SELECT id FROM districts WHERE code = %s", (dist['code'],))
                    district_id = cur.fetchone()[0]
                    logger.info(f"District {dist['name']} already exists with same code, using existing ID")
            
            district_code_to_id[dist['code']] = district_id
            conn.commit()
            time.sleep(RATE_LIMIT_DELAY)

            # For each district, fetch wards → write to file → insert to DB
            wards = fetch_all(ENDPOINTS['old']['wards'].format(district_code=dist['code']))
            old_wards.extend(wards)
            logger.info(f"  District {dist['name']} ({dist['code']}): {len(wards)} wards")
            
            # Write wards to file
            with open('vn_admin_units_dump.txt', 'a', encoding='utf-8') as f:
                f.write(f"\n=== WARDS FOR {dist['name']} ===\n")
                for ward in wards:
                    f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
            
            # Insert wards to DB
            for ward in wards:
                # Check if ward already exists by code
                cur.execute("SELECT id FROM wards WHERE code = %s", (ward['code'],))
                existing = cur.fetchone()
                
                if existing:
                    # Ward already exists, skip
                    logger.info(f"Ward {ward['name']} ({ward['code']}) already exists, skipping")
                    continue
                
                cur.execute(
                    "INSERT INTO wards (code, name, type, district_id) VALUES (%s, %s, %s, %s) ON CONFLICT (code) DO NOTHING",
                    (ward['code'], ward['name'], ward['type'], district_code_to_id[dist['code']])
                )
                conn.commit()
                time.sleep(RATE_LIMIT_DELAY)

    # --- NEW STRUCTURE ---
    logger.info('Fetching NEW provinces...')
    new_provinces = fetch_all(ENDPOINTS['new']['provinces'])
    logger.info(f'Fetched {len(new_provinces)} new provinces.')
    
    # Write new provinces to file
    with open('vn_admin_units_dump.txt', 'a', encoding='utf-8') as f:
        f.write(f"\n=== NEW STRUCTURE ===\n")
        f.write(f"Provinces: {len(new_provinces)}\n\n")
        f.write("=== NEW PROVINCES ===\n")
        for prov in new_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")

    # Insert new provinces to DB (handle conflicts with existing provinces)
    for prov in new_provinces:
        # Check if province already exists by code
        cur.execute("SELECT id FROM provinces WHERE code = %s", (prov['code'],))
        existing = cur.fetchone()
        
        if existing:
            # Province already exists, use existing ID
            province_id = existing[0]
            logger.info(f"Province {prov['name']} ({prov['code']}) already exists, using existing ID")
        else:
            # Insert new province
            cur.execute(
                "INSERT INTO provinces (code, name, type) VALUES (%s, %s, %s) ON CONFLICT (name) DO NOTHING RETURNING id",
                (prov['code'], prov['name'], prov['type'])
            )
            result = cur.fetchone()
            if result:
                province_id = result[0]
            else:
                # Province with same name exists, get its ID
                cur.execute("SELECT id FROM provinces WHERE name = %s", (prov['name'],))
                province_id = cur.fetchone()[0]
                logger.info(f"Province {prov['name']} already exists with different code, using existing ID")
        
        province_code_to_id[prov['code']] = province_id
        conn.commit()
        time.sleep(RATE_LIMIT_DELAY)

        # For each new province, fetch wards → write to file → insert to DB
        wards = fetch_all(ENDPOINTS['new']['wards'].format(province_code=prov['code']))
        new_wards.extend(wards)
        logger.info(f"Province {prov['name']} ({prov['code']}): {len(wards)} wards (new structure)")
        
        # Write new wards to file
        with open('vn_admin_units_dump.txt', 'a', encoding='utf-8') as f:
            f.write(f"\n=== NEW WARDS FOR {prov['name']} ===\n")
            for ward in wards:
                f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
        
        # Insert new wards to DB
        for ward in wards:
            # Check if ward already exists by code
            cur.execute("SELECT id FROM wards WHERE code = %s", (ward['code'],))
            existing = cur.fetchone()
            
            if existing:
                # Ward already exists, skip
                logger.info(f"Ward {ward['name']} ({ward['code']}) already exists, skipping")
                continue
            
            # For new structure, wards may not have district mapping, so set district_id to NULL
            cur.execute(
                "INSERT INTO wards (code, name, type, district_id) VALUES (%s, %s, %s, %s) ON CONFLICT (code) DO NOTHING",
                (ward['code'], ward['name'], ward['type'], None)
            )
            conn.commit()
            time.sleep(RATE_LIMIT_DELAY)

    # Final summary in file
    with open('vn_admin_units_dump.txt', 'a', encoding='utf-8') as f:
        f.write(f"\n=== SUMMARY ===\n")
        f.write(f"Total old provinces: {len(old_provinces)}\n")
        f.write(f"Total old districts: {len(old_districts)}\n")
        f.write(f"Total old wards: {len(old_wards)}\n")
        f.write(f"Total new provinces: {len(new_provinces)}\n")
        f.write(f"Total new wards: {len(new_wards)}\n")

    logger.info(f"All data has been written to vn_admin_units_dump.txt and inserted into database")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main() 