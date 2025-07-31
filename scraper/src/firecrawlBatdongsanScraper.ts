import { FirecrawlBaseScraper } from './firecrawlBaseScraper';
import * as cheerio from 'cheerio';
import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import { toCanonicalScrapedProperty } from './utils/typeConverters';
import { PropertyService } from './database/propertyService';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as https from 'https';
import { normalizeAddress } from './utils/addressNormalizer';
import { convertAddressIfNeeded } from './utils/addressConverter';
dotenv.config();

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY || ''
});

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const propertySchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.object({
    amount: z.number(),
    currency: z.string(),
    unit: z.string(),
    negotiable: z.boolean().optional()
  }),
  area: z.object({
    total: z.number(),
    unit: z.string()
  }),
  features: z.object({
    bedrooms: z.number().nullable(),
    bathrooms: z.number().nullable(),
    floors: z.number().nullable()
  }),
  address: z.object({
    full: z.string(),
    district: z.string(),
    ward: z.string(),
    coordinates: z.object({
      lat: z.number().nullable(),
      lng: z.number().nullable()
    })
  }),
  propertyType: z.string(),
  legalStatus: z.string(),
  direction: z.string(),
  projectName: z.string(),
  images: z.array(z.string()),
  contact: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string()
  }),
  url: z.string(),
  source: z.string(),
  scrapedAt: z.string(),
  postedDate: z.string().optional()
});

// Reference list of Vietnamese cities/provinces (can be loaded from DB or hardcoded)
const CITIES_PROVINCES = [
  'Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
];

export class FirecrawlBatdongsanScraper extends FirecrawlBaseScraper {
  async scrape(startUrl: string): Promise<any[]> {
    const maxPages = parseInt(process.env.FIRECRAWL_MAX_PAGES || '5', 10);
    const maxProperties = parseInt(process.env.FIRECRAWL_MAX_PROPERTIES || '20', 10);
    let currentPageUrl = startUrl;
    let pageCount = 0;
    const allPropertyUrls = new Set<string>();
    const log = (...args: any[]) => { if (this.config.debug) console.log('[Firecrawl][Batdongsan]', ...args); };
    const propertyService = new PropertyService();

    // 1. Pagination loop to collect all property URLs
    while (currentPageUrl && pageCount < maxPages && allPropertyUrls.size < maxProperties) {
      log(`Scraping page: ${currentPageUrl}`);
      const pageData = await this.firecrawlScrape(currentPageUrl);
      const html = pageData?.data?.html || '';
      const propertyUrls = await this.extractPropertyUrls(html, currentPageUrl);
      propertyUrls.forEach(url => allPropertyUrls.add(url));
      log(`Found ${propertyUrls.length} property URLs on page ${pageCount + 1}`);
      
      // Find next page URL
      const nextPageUrl = this.extractNextPageUrl(html, currentPageUrl);
      if (!nextPageUrl) break;
      currentPageUrl = nextPageUrl;
      pageCount++;
      if (allPropertyUrls.size >= maxProperties) break;
    }
    log(`Total unique property URLs found: ${allPropertyUrls.size}`);

    // 2. Process each property URL
    const results: any[] = [];
    let inserted = 0;
    let updated = 0;
    
    for (const url of Array.from(allPropertyUrls).slice(0, maxProperties)) {
      try {
        log(`Processing property: ${url}`);
        
        // STEP 1: Extract basic property data
        const propertyData = await this.extractBasicPropertyData(url);
        if (!propertyData) {
          log(`Failed to extract basic data from: ${url}`);
          continue;
        }

        // STEP 2: Insert property immediately with basic info
        let propertyId;
        try {
          propertyId = await propertyService.insertProperty(propertyData);
          if (!propertyId) {
            log(`✗ Failed to insert property: ${propertyData.title}`);
            continue;
          }
          log(`✓ Inserted property with basic info: ${propertyData.title} (ID: ${propertyId})`);
          inserted++;
        } catch (err) {
          log(`✗ Error inserting property: ${err}`);
          continue;
        }

        // STEP 3: Try address conversion and update if successful
        try {
          await this.processAddressConversion(propertyId, propertyData.address.full, propertyService);
          updated++;
        } catch (err) {
          log(`✗ Error during address conversion for property ${propertyId}: ${err}`);
        }

        results.push(propertyData);
      } catch (err) {
        log(`✗ Error processing property ${url}:`, err);
      }
    }
    
    log(`✓ Inserted ${inserted} properties, updated ${updated} with address conversion`);
    return results;
  }

  protected async extractPropertyUrls(html: string, pageUrl: string): Promise<string[]> {
    const $ = cheerio.load(html);
    const urls: string[] = [];
    const base = 'https://www.batdongsan.com.vn/';
    for (let k = 1; k <= 23; k++) {
      const selector = `#product-lists-web > div:nth-child(${k}) > a`;
      $(selector).each((_, el) => {
        let href = $(el).attr('href');
        if (href && !href.startsWith('#')) {
          // Combine with base if not absolute
          if (!href.startsWith('http')) {
            href = base.replace(/\/$/, '') + (href.startsWith('/') ? href : '/' + href);
          }
          if (!urls.includes(href)) urls.push(href);
        }
      });
    }
    if (this.config.debug) {
      console.log('[Firecrawl] Property URLs found:', urls);
    }
    return urls;
  }

  protected extractNextPageUrl(html: string, pageUrl: string): string | null {
    const $ = cheerio.load(html);
    // Try to find the next page link by rel, class, or text
    let nextHref = $('a[rel="next"]').attr('href');
    if (!nextHref) {
      // Try by class or text
      let found = false;
      $('a').each((_, el) => {
        if (found) return;
        const text = $(el).text().trim().toLowerCase();
        if (text === 'next' || text === 'sau' || text.includes('trang sau')) {
          nextHref = $(el).attr('href');
          found = true;
        }
      });
    }
    if (nextHref) {
      return nextHref.startsWith('http') ? nextHref : new URL(nextHref, pageUrl).href;
    }
    return null;
  }

  protected async extractPropertyDataFromPage(): Promise<any> {
    return null;
  }

  private async extractBasicPropertyData(url: string): Promise<any> {
    const log = (...args: any[]) => { if (this.config.debug) console.log('[ExtractBasic]', ...args); };
    
    try {
      // 1. Scrape the property page HTML
      const pageHtmlData = await this.firecrawlScrape(url);
      const html = pageHtmlData?.data?.html || '';
      const $ = cheerio.load(html);
      
      // 2. Extract address string
      const addressString = $(".js__pr-address").text().trim() || $("#product-detail-web > span").text().trim();
      log(`Extracted address: ${addressString}`);
      
      // 3. Parse address components
      const addressComponents = this.parseAddressComponents(addressString);
      
      // 4. Extract other property data using Firecrawl AI
      const extractionPrompt = `Extract the following fields as JSON. If a field is missing, use an empty string, null, or a reasonable default. \n\n{\n  "title": "string",\n  "description": "string",\n  "price": { "amount": "number", "currency": "string", "unit": "string", "negotiable": "boolean" },\n  "area": { "total": "number", "unit": "string" },\n  "features": { "bedrooms": "number|null", "bathrooms": "number|null", "floors": "number|null" },\n  "propertyType": "string",\n  "legalStatus": "string",\n  "direction": "string",\n  "projectName": "string",\n  "images": ["string"],\n  "contact": { "name": "string", "phone": "string", "email": "string" },\n  "url": "string",\n  "source": "string",\n  "scrapedAt": "string",\n  "postedDate": "string"\n}`;
      
      const scrapeResult = await app.extract([url], { prompt: extractionPrompt });
      if (!scrapeResult.success) {
        log(`Failed to extract property data: ${scrapeResult.error}`);
        return null;
      }
      
      let property = scrapeResult.data;
      property = toCanonicalScrapedProperty(property);
      
      // 5. Set up basic address structure
      property.address = {
        full: addressString || property.address?.full || '',
        province: addressComponents.province || property.address?.province || '',
        ward: addressComponents.ward || property.address?.ward || '',
        district: addressComponents.district || property.address?.district || '',
        coordinates: property.address?.coordinates || { lat: null, lng: null }
      };
      
      // 6. Basic address normalization
      const basicNormalizedAddress = await this.normalizeBasicAddress(addressComponents);
      
      // 7. Set normalized fields
      property.province_new = basicNormalizedAddress.province_name;
      property.ward_new = basicNormalizedAddress.ward_name;
      property.street_new = basicNormalizedAddress.street;
      property.province_id = basicNormalizedAddress.province_id;
      property.district_id = basicNormalizedAddress.district_id;
      property.ward_id = basicNormalizedAddress.ward_id;
      property.projectName = basicNormalizedAddress.project;
      
      // 8. Set conversion status fields
      property.is_converted = false;
      property.original_address = addressString;
      property.converted_address = null;
      property.conversion_error = null;
      property.address_conversion_date = null;
      
      return property;
    } catch (err) {
      log(`Error extracting basic property data: ${err}`);
      return null;
    }
  }

  private parseAddressComponents(addressString: string): any {
    const addressParts = addressString.split(',').map(part => part.trim());
    const provinceName = addressParts[addressParts.length - 1] || '';
    const districtName = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
    const wardName = addressParts.length > 2 ? addressParts[addressParts.length - 3] : '';
    const streetName = addressParts.length > 3 ? addressParts[addressParts.length - 4] : '';
    let projectName = addressParts.length > 4 ? addressParts.slice(0, addressParts.length - 4).join(', ') : '';
    
    // If the first compartment is not a recognized address unit, treat as project name
    const recognizedUnits = /^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Thị xã|Đường|Phố)/i;
    if (addressParts[0] && !recognizedUnits.test(addressParts[0])) {
      projectName = addressParts[0];
    }
    
    return {
      province: provinceName,
      district: districtName,
      ward: wardName,
      street: streetName,
      project: projectName
    };
  }

  private async normalizeBasicAddress(addressComponents: any): Promise<any> {
    try {
      return await normalizeAddress({
        province: addressComponents.province,
        district: addressComponents.district,
        ward: addressComponents.ward,
        street: addressComponents.street,
        project: addressComponents.project
      });
    } catch (err) {
      console.log('Error in basic address normalization:', err);
      return {
        province_id: null, province_name: addressComponents.province,
        district_id: null, district_name: addressComponents.district,
        ward_id: null, ward_name: addressComponents.ward,
        street: addressComponents.street, project: addressComponents.project,
        is_converted: false,
        original_address: '',
        converted_address: '',
        conversion_error: err instanceof Error ? err.message : 'Unknown error'
      };
    }
  }

  private async processAddressConversion(propertyId: number, originalAddress: string, propertyService: PropertyService): Promise<void> {
    const log = (...args: any[]) => { if (this.config.debug) console.log('[AddressConversion]', ...args); };
    
    try {
      log(`Starting address conversion for property ${propertyId}`);
      
      const conversionResult = await convertAddressIfNeeded(originalAddress);
      
      if (conversionResult.isConverted && conversionResult.convertedAddress) {
        log(`✓ Address conversion successful: ${conversionResult.originalAddress} → ${conversionResult.convertedAddress}`);
        
        // Parse converted address to update components
        const convertedParts = conversionResult.convertedAddress.split(',').map((part: string) => part.trim());
        if (convertedParts.length >= 3) {
          const convertedStreet = convertedParts[0] || '';
          const convertedWard = convertedParts[1] || '';
          const convertedProvince = convertedParts[2] || '';
          
          // Update property with converted address
          await propertyService.updateAddressConversionFields(propertyId, {
            is_converted: true,
            original_address: conversionResult.originalAddress,
            converted_address: conversionResult.convertedAddress,
            conversion_error: null,
            address_conversion_date: new Date(),
            province_new: convertedProvince,
            ward_new: convertedWard,
            street_new: convertedStreet
          });
          
          log(`✓ Updated property ${propertyId} with converted address`);
        }
      } else if (conversionResult.error) {
        log(`✗ Address conversion failed: ${conversionResult.error}`);
        
        // Update property with conversion error info
        await propertyService.updateAddressConversionFields(propertyId, {
          is_converted: false,
          original_address: conversionResult.originalAddress,
          converted_address: null,
          conversion_error: conversionResult.error,
          address_conversion_date: new Date()
        });
        
        log(`✓ Updated property ${propertyId} with conversion error`);
      }
    } catch (err) {
      log(`✗ Error during address conversion: ${err}`);
      
      // Update property with conversion error info
      await propertyService.updateAddressConversionFields(propertyId, {
        is_converted: false,
        original_address: originalAddress,
        converted_address: null,
        conversion_error: err instanceof Error ? err.message : 'Unknown error',
        address_conversion_date: new Date()
      });
      
      log(`✓ Updated property ${propertyId} with conversion error`);
    }
  }
}