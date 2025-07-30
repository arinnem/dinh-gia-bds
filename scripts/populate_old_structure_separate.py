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

# Endpoints for old structure
ENDPOINTS = {
    'provinces': f'{API_BASE}/provinces',
    'districts': f'{API_BASE}/provinces/{{province_code}}/districts',
    'wards': f'{API_BASE}/provinces/{{province_code}}/districts/{{district_code}}/wards'
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
    # Initialize data collections
    old_provinces = []
    old_districts = []
    old_wards = []
    
    # Initialize mapping dictionaries
    province_code_to_id = {}
    district_code_to_id = {}

    # --- OLD STRUCTURE ONLY ---
    logger.info('Fetching OLD provinces...')
    old_provinces = fetch_all(ENDPOINTS['provinces'])
    logger.info(f'Fetched {len(old_provinces)} old provinces.')
    
    # Write old provinces to separate file
    with open('vn_old_structure_dump.txt', 'w', encoding='utf-8') as f:
        f.write("=== VIETNAM OLD STRUCTURE ADMINISTRATIVE UNITS DUMP ===\n\n")
        f.write(f"OLD STRUCTURE (Before July 1st, 2025):\n")
        f.write(f"Provinces: {len(old_provinces)}\n\n")
        f.write("=== OLD PROVINCES ===\n")
        for prov in old_provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")

    # For each old province, fetch districts → write to file
    for prov in old_provinces:
        logger.info(f"Fetching districts for province: {prov['name']} ({prov['code']})")
        districts = fetch_all(ENDPOINTS['districts'].format(province_code=prov['code']))
        old_districts.extend(districts)
        logger.info(f"Province {prov['name']} ({prov['code']}): {len(districts)} districts")
        
        # Write old districts to separate file
        with open('vn_old_structure_dump.txt', 'a', encoding='utf-8') as f:
            f.write(f"\n=== OLD DISTRICTS FOR {prov['name']} ===\n")
            for district in districts:
                f.write(f"{district['code']}: {district['name']} ({district['type']})\n")
        
        # For each district, fetch wards → write to file
        for district in districts:
            logger.info(f"Fetching wards for district: {district['name']} ({district['code']}) in province: {prov['name']}")
            wards = fetch_all(ENDPOINTS['wards'].format(province_code=prov['code'], district_code=district['code']))
            old_wards.extend(wards)
            logger.info(f"District {district['name']} ({district['code']}): {len(wards)} wards")
            
            # Write old wards to separate file
            with open('vn_old_structure_dump.txt', 'a', encoding='utf-8') as f:
                f.write(f"\n=== OLD WARDS FOR {district['name']} ({district['code']}) IN {prov['name']} ===\n")
                for ward in wards:
                    f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")

    # Final summary in separate file
    with open('vn_old_structure_dump.txt', 'a', encoding='utf-8') as f:
        f.write(f"\n=== SUMMARY ===\n")
        f.write(f"Total old provinces: {len(old_provinces)}\n")
        f.write(f"Total old districts: {len(old_districts)}\n")
        f.write(f"Total old wards: {len(old_wards)}\n")

    logger.info(f"All old structure data has been written to vn_old_structure_dump.txt")
    logger.info(f"Summary: {len(old_provinces)} provinces, {len(old_districts)} districts, {len(old_wards)} wards")

if __name__ == "__main__":
    main() 