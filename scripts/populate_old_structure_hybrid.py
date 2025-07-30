import requests
import time
from bs4 import BeautifulSoup

API_BASE = 'https://tinhthanhpho.com/api/v1'
TXT_FILE = 'vn_old_structure_dump_hybrid.txt'
RATE_LIMIT_DELAY = 0.065  # 1000 requests/minute

# Fetch all paginated provinces
def fetch_all_provinces():
    provinces = []
    page = 1
    per_page = 20
    while True:
        url = f"{API_BASE}/provinces?page={page}&per_page={per_page}"
        print(f"Fetching provinces page {page}...")
        data = fetch_json(url)
        if not data or 'data' not in data or not data['data']:
            break
        provinces.extend(data['data'])
        if len(data['data']) < per_page:
            break
        page += 1
        time.sleep(RATE_LIMIT_DELAY)
    print(f"Total provinces fetched: {len(provinces)}")
    return provinces

def fetch_json(url):
    for _ in range(3):
        try:
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            time.sleep(2)
    return None

def fetch_wards_html(province_code, district_code):
    url = f"https://tinhthanhpho.com/search/wards?district_code={district_code}&province_code={province_code}"
    for _ in range(3):
        try:
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            return resp.text
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            time.sleep(2)
    return None

def parse_wards(html):
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table")
    wards = []
    if not table:
        return wards
    rows = table.find_all("tr")[1:]  # skip header
    for row in rows:
        cols = row.find_all("td")
        if len(cols) >= 3:
            code = cols[0].text.strip()
            name = cols[1].text.strip()
            ward_type = cols[2].text.strip()
            wards.append({"code": code, "name": name, "type": ward_type})
    return wards

def main():
    with open(TXT_FILE, "w", encoding="utf-8") as f:
        f.write("=== VIETNAM OLD STRUCTURE ADMINISTRATIVE UNITS DUMP ===\n\n")

        # Fetch all provinces with pagination
        provinces = fetch_all_provinces()
        f.write(f"Provinces: {len(provinces)}\n\n")
        f.write("=== OLD PROVINCES ===\n")
        for prov in provinces:
            f.write(f"{prov['code']}: {prov['name']} ({prov['type']})\n")
        f.write("\n")

        for prov in provinces:
            prov_code = prov["code"]
            prov_name = prov["name"]
            print(f"Processing province: {prov_name} ({prov_code})")
            f.write(f"\n=== DISTRICTS FOR {prov_name} ===\n")
            # Fetch districts for this province
            districts_data = fetch_json(f"{API_BASE}/provinces/{prov_code}/districts")
            districts = districts_data["data"] if districts_data and "data" in districts_data else []
            for dist in districts:
                f.write(f"{dist['code']}: {dist['name']} ({dist['type']})\n")
            f.write("\n")

            for dist in districts:
                dist_code = dist["code"]
                dist_name = dist["name"]
                print(f"  Processing district: {dist_name} ({dist_code}) in {prov_name}")
                f.write(f"\n=== WARDS FOR {dist_name} ({dist_code}) IN {prov_name} ===\n")
                html = fetch_wards_html(prov_code, dist_code)
                wards = parse_wards(html) if html else []
                print(f"    Found {len(wards)} wards.")
                for ward in wards:
                    f.write(f"{ward['code']}: {ward['name']} ({ward['type']})\n")
                time.sleep(RATE_LIMIT_DELAY)

if __name__ == "__main__":
    main()