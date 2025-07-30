import psycopg2
import requests
import time
import os
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'database': os.getenv('DB_NAME', 'dinh_gia_bds')
}

API_BASE = 'https://tinhthanhpho.com/api/v1'
RATE_LIMIT_DELAY = 0.065  # seconds between requests (1000/minute)

# Endpoints for new structure only
ENDPOINTS = {
    'provinces': f'{API_BASE}/new-provinces',
    'wards': f'{API_BASE}/new-provinces/{{province_code}}/wards'
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
    per_page = 20  # Use smaller page size to ensure we get all data
    
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
            
        # Check if we have metadata with total count
        if 'metadata' in data and 'total' in data['metadata']:
            total = data['metadata']['total']
            logger.info(f"Page {page}: Got {len(data['data'])} items, total should be {total}, current total: {len(all_data)}")
            if len(all_data) >= total:
                logger.info(f"Reached total count of {total}, stopping pagination")
                break
            
        page += 1
        time.sleep(RATE_LIMIT_DELAY)
    
    logger.info(f"Total fetched: {len(all_data)} items")
    return all_data

def main():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    # Initialize data collections
    new_provinces = []
    new_wards = []
    
    # Initialize mapping dictionary
    province_code_to_id = {}

    # --- NEW STRUCTURE ONLY ---
    logger.info('Fetching NEW provinces...')
    new_provinces = fetch_all(ENDPOINTS['provinces'])
    logger.info(f'Fetched {len(new_provinces)} new provinces.')
    
    # Write new provinces to separate file
    with open('vn_new_structure_dump.txt', 'w', encoding='utf-8') as f:
        f.write("=== VIETNAM NEW STRUCTURE ADMINISTRATIVE UNITS DUMP ===\n\n")
        f.write(f"NEW STRUCTURE (After July 1st, 2025):\n")
        f.write(f"Provinces: {len(new_provinces)}\n\n")
        f.write("=== NEW PROVINCES ===\n")
        for prov in new_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")

    # Insert new provinces to separate table
    for prov in new_provinces:
        cur.execute(
            "INSERT INTO provinces_new (code, name, type) VALUES (%s, %s, %s) ON CONFLICT (code) DO NOTHING RETURNING id",
            (prov['code'], prov['name'], prov['type'])
        )
        result = cur.fetchone()
        if result:
            province_id = result[0]
            province_code_to_id[prov['code']] = province_id
            logger.info(f"Inserted new province: {prov['name']} ({prov['code']})")
        else:
            # Province already exists, get its ID
            cur.execute("SELECT id FROM provinces_new WHERE code = %s", (prov['code'],))
            province_id = cur.fetchone()[0]
            province_code_to_id[prov['code']] = province_id
            logger.info(f"Province {prov['name']} ({prov['code']}) already exists")
        
        conn.commit()
        time.sleep(RATE_LIMIT_DELAY)

        # For each new province, fetch wards → write to file → insert to separate table
        wards = fetch_all(ENDPOINTS['wards'].format(province_code=prov['code']))
        new_wards.extend(wards)
        logger.info(f"Province {prov['name']} ({prov['code']}): {len(wards)} wards (new structure)")
        
        # Write new wards to separate file
        with open('vn_new_structure_dump.txt', 'a', encoding='utf-8') as f:
            f.write(f"\n=== NEW WARDS FOR {prov['name']} ===\n")
            for ward in wards:
                f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
        
        # Insert new wards to separate table
        for ward in wards:
            cur.execute(
                "INSERT INTO wards_new (code, name, type, province_id) VALUES (%s, %s, %s, %s) ON CONFLICT (code) DO NOTHING",
                (ward['code'], ward['name'], ward['type'], province_code_to_id[prov['code']])
            )
            conn.commit()
            time.sleep(RATE_LIMIT_DELAY)

    # Final summary in separate file
    with open('vn_new_structure_dump.txt', 'a', encoding='utf-8') as f:
        f.write(f"\n=== SUMMARY ===\n")
        f.write(f"Total new provinces: {len(new_provinces)}\n")
        f.write(f"Total new wards: {len(new_wards)}\n")

    logger.info(f"All new structure data has been written to vn_new_structure_dump.txt and inserted into separate tables")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main() 