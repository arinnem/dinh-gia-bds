import asyncio
import httpx # For fetching sitemaps and potentially robots.txt
import xml.etree.ElementTree as ET
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
import random
import os
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path

# Assuming your PropertyCreate schema and PropertyService are accessible
# This is a conceptual import path, adjust based on your project structure
# from app.schemas.property_schemas import PropertyCreate
# from app.services.property_service import PropertyService
# from app.db.database import database # if service needs direct db access or for main script

# --- Configuration ---
ALONHADAT_BASE_URL = "https://alonhadat.com.vn"
SITEMAP_URLS = [
    "https://alonhadat.com.vn/sitemap.xml",
    "https://alonhadat.com.vn/sitemap01.xml",
    "https://alonhadat.com.vn/sitemap02.xml"
]
# ROBOTS_URL = "https://alonhadat.com.vn/robots.txt" # Can fetch and parse if needed

# Disallowed paths from robots.txt (simplified for this example)
DISALLOWED_PATTERNS = [
    "/publish/handler/",
    "/publish/form/",
    "/nha-dat/can-mua/",
    "/nha-dat/can-thue/"
]

# --- Helper Functions ---

def is_allowed(url, base_url=ALONHADAT_BASE_URL):
    """Checks if a URL is allowed by simplified robots.txt rules."""
    if not url.startswith(base_url):
        return False # External link
    path = url.replace(base_url, "")
    for pattern in DISALLOWED_PATTERNS:
        if path.startswith(pattern):
            return False
    return True

async def fetch_sitemap_urls(sitemap_url: str) -> List[str]:
    """Fetches and parses a sitemap, returning a list of URLs."""
    urls = []
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(sitemap_url, timeout=30.0)
            response.raise_for_status() # Raise an exception for bad status codes

        root = ET.fromstring(response.content)
        # XML namespace, often present in sitemaps
        namespace = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

        for url_element in root.findall('sitemap:url', namespace):
            loc_element = url_element.find('sitemap:loc', namespace)
            if loc_element is not None and loc_element.text:
                urls.append(loc_element.text.strip())
    except httpx.HTTPStatusError as e:
        print(f"HTTP error fetching sitemap {sitemap_url}: {e.status_code} - {e.response.text}")
    except ET.ParseError as e:
        print(f"Error parsing XML from sitemap {sitemap_url}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred fetching sitemap {sitemap_url}: {e}")
    return urls

def setup_selenium_driver(headless: bool = True):
    """Sets up and returns a Selenium WebDriver instance."""
    options = webdriver.ChromeOptions()
    if headless:
        options.add_argument("--headless")  # Run in headless mode (no browser UI)
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")  # Set window size for consistent screenshots
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36")
    try:
        driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options)
    except Exception as e:
        print(f"Error setting up ChromeDriverManager: {e}")
        print("Attempting to use system chromedriver if available in PATH.")
        driver = webdriver.Chrome(options=options) # Fallback to system chromedriver
    return driver

def capture_page_screenshot(driver, url: str, screenshots_dir: str = "screenshots") -> Optional[Dict[str, Any]]:
    """Captures a screenshot of the current page and saves it."""
    try:
        # Create screenshots directory if it doesn't exist
        Path(screenshots_dir).mkdir(parents=True, exist_ok=True)
        
        # Generate unique filename
        screenshot_id = str(uuid.uuid4())
        filename = f"screenshot_{screenshot_id}.png"
        filepath = os.path.join(screenshots_dir, filename)
        
        # Capture screenshot
        driver.save_screenshot(filepath)
        
        # Get file size
        file_size = os.path.getsize(filepath)
        
        screenshot_data = {
            "screenshot_id": screenshot_id,
            "screenshot_path": filepath,
            "screenshot_url": f"/screenshots/{filename}",  # URL path for serving
            "page_url": url,
            "file_size": file_size,
            "image_format": "png",
            "captured_at": datetime.utcnow()
        }
        
        print(f"Screenshot captured: {filepath} ({file_size} bytes)")
        return screenshot_data
        
    except Exception as e:
        print(f"Error capturing screenshot for {url}: {e}")
        return None

def parse_listing_page(html_content: str, url: str, screenshot_data: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """
    Parses the HTML content of a single listing page.
    This function requires ACTUAL CSS SELECTORS from alonhadat.com.vn.
    The selectors below are placeholders and WILL NOT WORK without being updated.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    data = {"listing_url": url, "data_source_listing": "alonhadat.com.vn", "scraped_at": datetime.utcnow()}
    
    # Include screenshot data if available
    if screenshot_data:
        data["screenshot_data"] = screenshot_data

    try:
        # --- !!! THESE ARE PLACEHOLDERS - UPDATE WITH ACTUAL SELECTORS !!! ---
        title_element = soup.select_one('h1.title-property') # Example selector
        data['address_full'] = title_element.text.strip() if title_element else None # Often part of title or a specific field

        price_element = soup.select_one('.price .value') # Example
        if price_element:
            price_text = price_element.text.strip()
            # TODO: Convert price_text (e.g., "10 tỷ", "500 triệu/m²") to a numeric value (float) and set currency
            # This requires robust parsing logic for Vietnamese currency formats.
            data['listing_price'] = None # Placeholder for parsed numeric price
            data['listing_price_currency'] = "VND"

        area_element = soup.select_one('.square .value') # Example
        if area_element:
            area_text = area_element.text.strip().replace(' m²', '')
            try:
                data['floor_area_sqm'] = float(area_text) # Or land_area_sqm depending on context
            except ValueError:
                data['floor_area_sqm'] = None

        description_element = soup.select_one('.detail.text-content') # Example
        data['description'] = description_element.text.strip() if description_element else None

        # Example for other fields (highly dependent on site structure)
        # data['property_type'] = soup.select_one('.property-type-selector').text.strip()
        # data['address_city'] = soup.select_one('.location .city').text.strip()
        # data['address_district'] = soup.select_one('.location .district').text.strip()
        # data['num_bedrooms'] = soup.select_one('.bedrooms-selector').text.strip()
        # data['num_bathrooms'] = soup.select_one('.bathrooms-selector').text.strip()

        # Lat/Long might be in a script tag, meta tag, or map data attributes
        # Example: map_element = soup.select_one('div.map-container[data-lat][data-lng]')
        # if map_element:
        #     data['latitude'] = float(map_element['data-lat'])
        #     data['longitude'] = float(map_element['data-lng'])

        # If any essential field (like price or address) is missing, maybe return None
        if not data.get('address_full') or not data.get('listing_price'): # Adjust this condition
            # print(f"Essential data missing for {url}, skipping.")
            # return None
            pass # For now, let it pass even if some fields are missing

        return data
    except Exception as e:
        print(f"Error parsing page {url}: {e}")
        return None

async def scrape_single_listing(driver, url: str, property_service=None): # Add service if saving directly
    """Scrapes a single listing page."""
    if not is_allowed(url):
        print(f"Skipping disallowed URL (robots.txt): {url}")
        return None

    print(f"Scraping: {url}")
    try:
        driver.get(url)
        # Wait for a key element to be present (e.g., property title or price)
        # WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "h1.title-property"))) # Example
        await asyncio.sleep(random.uniform(2, 5)) # Respectful delay

        # Capture screenshot after page loads
        screenshot_data = capture_page_screenshot(driver, url)
        
        page_content = driver.page_source
        parsed_data = parse_listing_page(page_content, url, screenshot_data)

        if parsed_data:
            print(f"Successfully parsed: {parsed_data.get('address_full', url)}")
            # Here, you would save it to the database using your PropertyService
            # Example:
            # if property_service:
            #     try:
            #         property_create_schema = PropertyCreate(**parsed_data) # Validate data
            #         await property_service.create_property(property_data=property_create_schema)
            #         print(f"Saved to DB: {url}")
            #     except Exception as db_error: # Catch Pydantic validation errors or DB errors
            #         print(f"Error saving to DB {url}: {db_error}")
            #         print(f"Data that failed: {parsed_data}")
            return parsed_data
    except Exception as e:
        print(f"Error scraping URL {url}: {e}")
    return None

async def main_scraper_alonhadat(limit_pages: Optional[int] = None, property_service=None):
    """Main function to orchestrate the alonhadat.com.vn scraper."""
    print("Starting alonhadat.com.vn scraper...")

    all_listing_urls = []
    for sitemap_url in SITEMAP_URLS:
        print(f"Fetching URLs from sitemap: {sitemap_url}")
        sitemap_listing_urls = await fetch_sitemap_urls(sitemap_url)
        # Filter for allowed URLs and typically those that look like property detail pages
        # Example: filter for URLs containing '/nha-dat/can-ban/' or '/nha-dat/cho-thue/'
        # and not matching disallowed patterns.
        for url in sitemap_listing_urls:
            if "/nha-dat/can-ban/" in url or "/nha-dat/cho-thue/" in url: # Focus on sale/rent listings
                 if is_allowed(url):
                    all_listing_urls.append(url)
        print(f"Found {len(sitemap_listing_urls)} URLs in {sitemap_url}, {len(all_listing_urls)} relevant and allowed so far.")
        await asyncio.sleep(random.uniform(1, 3)) # Delay between sitemap fetches

    if not all_listing_urls:
        print("No listing URLs found from sitemaps. Exiting.")
        return

    # Randomize and limit for testing/development
    random.shuffle(all_listing_urls)
    urls_to_scrape = all_listing_urls[:limit_pages] if limit_pages else all_listing_urls
    print(f"Will attempt to scrape {len(urls_to_scrape)} URLs.")

    driver = setup_selenium_driver()
    scraped_data_list = []

    try:
        for i, url in enumerate(urls_to_scrape):
            data = await scrape_single_listing(driver, url, property_service)
            if data:
                scraped_data_list.append(data)

            # Polite delay between requests
            await asyncio.sleep(random.uniform(3, 7))

            if (i + 1) % 20 == 0: # Log progress
                print(f"Scraped {i+1}/{len(urls_to_scrape)} URLs...")

    finally:
        driver.quit()
        print(f"Finished scraping. Total items processed: {len(urls_to_scrape)}, successfully parsed: {len(scraped_data_list)}")

    # For testing, print collected data
    # for item in scraped_data_list:
    #    print(item)

    return scraped_data_list


# --- Main execution (example) ---
if __name__ == "__main__":
    # This part is for standalone execution.
    # In your FastAPI app, you'd call main_scraper_alonhadat as a background task or a scheduled job.

    # --- Setup for standalone run (conceptual, adapt to your project) ---
    # This requires your FastAPI app's database connection to be available if saving directly.
    # For a simple standalone test, you might just print the data.

    # Example of how to run the database connection for a standalone script:
    # async def run_with_db():
    #     from app.db.database import connect_db, disconnect_db # Adjust import
    #     await connect_db()
    #     try:
    #         # If you want to use the service to save data:
    #         # from app.services.property_service import PropertyService # Adjust import
    #         # service = PropertyService()
    #         # await main_scraper_alonhadat(limit_pages=5, property_service=service) # Scrape 5 pages

    #         # Or just print the scraped data without saving:
    #         scraped_items = await main_scraper_alonhadat(limit_pages=5)
    #         print("\n--- Scraped Items (Not Saved) ---")
    #         for item in scraped_items:
    #             print(item)

    #     finally:
    #         await disconnect_db()

    # if __name__ == "__main__":
    #    asyncio.run(run_with_db())

    # Simpler run for just printing, no DB interaction in this example:
    async def run_scraper_standalone():
        print("Running alonhadat_scraper.py standalone for testing (will not save to DB).")
        scraped_items = await main_scraper_alonhadat(limit_pages=2) # Scrape 2 pages for test
        if scraped_items:
            print(f"\n--- {len(scraped_items)} Scraped Items (Not Saved) ---")
            for item in scraped_items:
                print(item)
        else:
            print("No items were scraped.")

    asyncio.run(run_scraper_standalone())
```
