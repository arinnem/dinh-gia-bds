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

    // 1. Pagination loop
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

    // 2. Extract property data using Firecrawl extract
    const results: any[] = [];
    let inserted = 0;
    for (const url of Array.from(allPropertyUrls).slice(0, maxProperties)) {
      try {
        log(`Extracting property data from: ${url}`);
        // 1. Scrape the property page HTML
        const pageHtmlData = await this.firecrawlScrape(url);
        const html = pageHtmlData?.data?.html || '';
        const $ = cheerio.load(html);
        if (this.config.debug) {
          console.log('[DEBUG][Address Extraction] Raw HTML length:', html.length);
          console.log('[DEBUG][Address Extraction] .js__pr-address:', $(".js__pr-address").text());
          console.log('[DEBUG][Address Extraction] #product-detail-web > span:', $("#product-detail-web > span").text());
        }
        // 2. Extract address string using robust selector
        const addressString = $(".js__pr-address").text().trim() || $("#product-detail-web > span").text().trim();
        if (this.config.debug) {
          console.log('[DEBUG][Address Extraction] Final addressString:', addressString);
        }
        // Split-based extraction for Vietnamese address format
        const addressParts = addressString.split(',').map(part => part.trim());
        const provinceNameSplit = addressParts[addressParts.length - 1] || '';
        const districtNameSplit = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
        const wardNameSplit = addressParts.length > 2 ? addressParts[addressParts.length - 3] : '';
        const streetNameSplit = addressParts.length > 3 ? addressParts[addressParts.length - 4] : '';
        let projectNameSplit = addressParts.length > 4 ? addressParts.slice(0, addressParts.length - 4).join(', ') : '';
        // If the first compartment is not a recognized address unit, treat as project name
        const recognizedUnits = /^(Phường|Xã|Thị trấn|Quận|Huyện|Thành phố|Thị xã|Đường|Phố)/i;
        if (addressParts[0] && !recognizedUnits.test(addressParts[0])) {
          projectNameSplit = addressParts[0];
        }
        if (this.config.debug) {
          console.log('[DEBUG][Address Extraction][Split] projectName:', projectNameSplit);
          console.log('[DEBUG][Address Extraction][Split] wardName:', wardNameSplit);
          console.log('[DEBUG][Address Extraction][Split] districtName:', districtNameSplit);
          console.log('[DEBUG][Address Extraction][Split] provinceName:', provinceNameSplit);
          console.log('[DEBUG][Address Extraction][Split] streetName:', streetNameSplit);
        }
        // Use split-based values for main logic
        let provinceName = provinceNameSplit;
        let districtName = districtNameSplit;
        let wardName = wardNameSplit;
        let streetName = streetNameSplit;
        let projectName = projectNameSplit;
        // 4.1. Use API for reference to get codes for province, district, ward
        // REMOVE ALL API CALLS - use DB lookup instead
        let normalizedAddress;
        try {
          normalizedAddress = await normalizeAddress({
            province: provinceName,
            district: districtName,
            ward: wardName,
            street: streetName,
            project: projectName
          });
          if (this.config.debug) {
            console.log('[DEBUG][Normalized Address]', normalizedAddress);
          }
        } catch (err) {
          log('Error normalizing address using DB:', err);
          normalizedAddress = {
            province_id: null, province_name: provinceName,
            district_id: null, district_name: districtName,
            ward_id: null, ward_name: wardName,
            street: streetName, project: projectName
          };
        }
        // 5. Now call Firecrawl AI extract for other fields (not address)
        const extractionPrompt = `Extract the following fields as JSON. If a field is missing, use an empty string, null, or a reasonable default. \n\n{\n  "title": "string",\n  "description": "string",\n  "price": { "amount": "number", "currency": "string", "unit": "string", "negotiable": "boolean" },\n  "area": { "total": "number", "unit": "string" },\n  "features": { "bedrooms": "number|null", "bathrooms": "number|null", "floors": "number|null" },\n  "propertyType": "string",\n  "legalStatus": "string",\n  "direction": "string",\n  "projectName": "string",\n  "images": ["string"],\n  "contact": { "name": "string", "phone": "string", "email": "string" },\n  "url": "string",\n  "source": "string",\n  "scrapedAt": "string",\n  "postedDate": "string"\n}`;
        const scrapeResult = await app.extract([url], { prompt: extractionPrompt });
        if (!scrapeResult.success) {
          log(`Failed to extract: ${scrapeResult.error}`);
          continue;
        }
        let property = scrapeResult.data;
        // Validate and normalize
        property = toCanonicalScrapedProperty(property);
        // Overwrite address fields with normalized values if present, otherwise keep AI extract
        property.address = {
          full: addressString || property.address?.full || '',
          province: normalizedAddress.province_name || property.address?.province || '',
          ward: normalizedAddress.ward_name || property.address?.ward || '',
          district: normalizedAddress.district_name || property.address?.district || '',
          coordinates: property.address?.coordinates || { lat: null, lng: null }
        };
        // 6. Store normalized names and IDs for DB
        property.province_new = normalizedAddress.province_name;
        property.ward_new = normalizedAddress.ward_name;
        property.street_new = normalizedAddress.street;
        property.province_id = normalizedAddress.province_id;
        property.district_id = normalizedAddress.district_id;
        property.ward_id = normalizedAddress.ward_id;
        property.projectName = normalizedAddress.project;
        // Insert into DB
        await propertyService.insertProperty(property);
        results.push(property);
        inserted++;
        log(`Inserted property: ${property.title} (${url})`);
      } catch (err) {
        log(`Error scraping property ${url}:`, err);
      }
    }
    log(`Inserted ${inserted} properties into the database.`);
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
}