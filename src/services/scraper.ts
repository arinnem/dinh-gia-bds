import axios from 'axios';
import * as cheerio from 'cheerio';
import { Property, PropertySearchCriteria } from '../types/property';

interface ScrapedProperty {
  sourceUrl: string;
  sourceSite: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  frontage?: number;
  fullAddress?: string;
  location?: { lat: number; lng: number };
  additionalFeatures?: Record<string, any>;
  publishedAt?: Date;
  images?: string[];
}

interface ScraperConfig {
  baseUrl: string;
  selectors: {
    propertyList: string;
    title: string;
    price: string;
    area: string;
    address: string;
    description: string;
    bedrooms?: string;
    bathrooms?: string;
    floors?: string;
    images?: string;
    publishedDate?: string;
  };
  priceRegex: RegExp;
  areaRegex: RegExp;
}

class RealEstateScraper {
  private configs: Record<string, ScraperConfig> = {
    'batdongsan.com.vn': {
      baseUrl: 'https://batdongsan.com.vn',
      selectors: {
        propertyList: '.js__product-link-for-product-id',
        title: '.pr-title a, .product-title',
        price: '.product-price, .price',
        area: '.product-area, .area',
        address: '.product-address, .address',
        description: '.product-description, .description',
        bedrooms: '.bedroom, .phong-ngu',
        bathrooms: '.bathroom, .phong-tam',
        floors: '.floor, .tang',
        images: '.product-avatar img, .product-image img',
        publishedDate: '.product-published-info, .published-date'
      },
      priceRegex: /([\d,\.]+)\s*(tỷ|triệu|nghìn|ngàn)/gi,
      areaRegex: /([\d,\.]+)\s*m[²2]/gi
    },
    'alonhadat.com.vn': {
      baseUrl: 'https://alonhadat.com.vn',
      selectors: {
        propertyList: '.content-item',
        title: '.ct_title a, .title',
        price: '.price1, .gia-ban',
        area: '.area, .dien-tich',
        address: '.address, .dia-chi',
        description: '.content-text, .mo-ta',
        bedrooms: '.phong-ngu',
        bathrooms: '.phong-tam',
        images: '.ct_image img, .hinh-anh img'
      },
      priceRegex: /([\d,\.]+)\s*(tỷ|triệu|nghìn|ngàn)/gi,
      areaRegex: /([\d,\.]+)\s*m[²2]/gi
    },
    'nhadat24h.net': {
      baseUrl: 'https://nhadat24h.net',
      selectors: {
        propertyList: '.p-title',
        title: 'a',
        price: '.p-price, .gia',
        area: '.p-area, .dien-tich',
        address: '.p-address, .dia-chi',
        description: '.p-content, .noi-dung',
        images: '.p-image img'
      },
      priceRegex: /([\d,\.]+)\s*(tỷ|triệu|nghìn|ngàn)/gi,
      areaRegex: /([\d,\.]+)\s*m[²2]/gi
    }
  };

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parsePrice(priceText: string): number | undefined {
    if (!priceText) return undefined;
    
    const match = priceText.match(/([\d,\.]+)\s*(tỷ|triệu|nghìn|ngàn)/i);
    if (!match) return undefined;

    const value = parseFloat(match[1].replace(/[,\.]/g, ''));
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'tỷ':
        return value * 1000000000;
      case 'triệu':
        return value * 1000000;
      case 'nghìn':
      case 'ngàn':
        return value * 1000;
      default:
        return value;
    }
  }

  private parseArea(areaText: string): number | undefined {
    if (!areaText) return undefined;
    
    const match = areaText.match(/([\d,\.]+)/i);
    if (!match) return undefined;

    return parseFloat(match[1].replace(/[,]/g, ''));
  }

  private extractNumber(text: string): number | undefined {
    if (!text) return undefined;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : undefined;
  }

  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | undefined> {
    try {
      // Using a free geocoding service (you might want to use Google Maps API with your key)
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: `${address}, Ho Chi Minh City, Vietnam`,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'RealEstateScraper/1.0'
        }
      });

      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        };
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }
    return undefined;
  }

  async scrapePropertyDetails(url: string, siteName: string): Promise<ScrapedProperty | null> {
    try {
      const config = this.configs[siteName];
      if (!config) {
        throw new Error(`No configuration found for site: ${siteName}`);
      }

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const title = $(config.selectors.title).first().text().trim();
      const priceText = $(config.selectors.price).first().text().trim();
      const areaText = $(config.selectors.area).first().text().trim();
      const address = $(config.selectors.address).first().text().trim();
      const description = $(config.selectors.description).first().text().trim();
      
      const price = this.parsePrice(priceText);
      const area = this.parseArea(areaText);
      
      // Extract additional details
      const bedrooms = config.selectors.bedrooms ? 
        this.extractNumber($(config.selectors.bedrooms).first().text()) : undefined;
      const bathrooms = config.selectors.bathrooms ? 
        this.extractNumber($(config.selectors.bathrooms).first().text()) : undefined;
      const floors = config.selectors.floors ? 
        this.extractNumber($(config.selectors.floors).first().text()) : undefined;

      // Extract images
      const images: string[] = [];
      if (config.selectors.images) {
        $(config.selectors.images).each((_, img) => {
          const src = $(img).attr('src') || $(img).attr('data-src');
          if (src) {
            images.push(src.startsWith('http') ? src : `${config.baseUrl}${src}`);
          }
        });
      }

      // Get location coordinates
      const location = address ? await this.geocodeAddress(address) : undefined;

      const scrapedProperty: ScrapedProperty = {
        sourceUrl: url,
        sourceSite: siteName,
        title,
        description: description || undefined,
        price,
        area,
        bedrooms,
        bathrooms,
        floors,
        fullAddress: address || undefined,
        location,
        images,
        publishedAt: new Date(),
        additionalFeatures: {
          hasImages: images.length > 0,
          imageCount: images.length
        }
      };

      return scrapedProperty;
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return null;
    }
  }

  async scrapePropertyList(siteName: string, searchParams: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
  } = {}): Promise<string[]> {
    try {
      const config = this.configs[siteName];
      if (!config) {
        throw new Error(`No configuration found for site: ${siteName}`);
      }

      // Build search URL based on site
      let searchUrl = config.baseUrl;
      
      switch (siteName) {
        case 'batdongsan.com.vn':
          searchUrl += '/ban-can-ho-chung-cu';
          if (searchParams.location) searchUrl += `/${searchParams.location}`;
          if (searchParams.page) searchUrl += `/p${searchParams.page}`;
          break;
        case 'alonhadat.com.vn':
          searchUrl += '/nha-dat/can-ban';
          if (searchParams.page) searchUrl += `?page=${searchParams.page}`;
          break;
        case 'nhadat24h.net':
          searchUrl += '/ban-nha-dat';
          if (searchParams.page) searchUrl += `?page=${searchParams.page}`;
          break;
      }

      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const propertyUrls: string[] = [];

      $(config.selectors.propertyList).each((_, element) => {
        const link = $(element).find('a').first().attr('href') || $(element).attr('href');
        if (link) {
          const fullUrl = link.startsWith('http') ? link : `${config.baseUrl}${link}`;
          propertyUrls.push(fullUrl);
        }
      });

      return propertyUrls.slice(0, 20); // Limit to 20 properties per request
    } catch (error) {
      console.error(`Error scraping property list from ${siteName}:`, error);
      return [];
    }
  }

  async scrapeMultipleSites(searchParams: {
    location?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    maxProperties?: number;
  } = {}): Promise<ScrapedProperty[]> {
    const allProperties: ScrapedProperty[] = [];
    const maxProperties = searchParams.maxProperties || 50;
    
    for (const siteName of Object.keys(this.configs)) {
      try {
        console.log(`Scraping ${siteName}...`);
        
        // Get property URLs
        const propertyUrls = await this.scrapePropertyList(siteName, searchParams);
        
        // Scrape each property with delay to avoid being blocked
        for (const url of propertyUrls) {
          if (allProperties.length >= maxProperties) break;
          
          const property = await this.scrapePropertyDetails(url, siteName);
          if (property) {
            allProperties.push(property);
          }
          
          // Add delay between requests
          await this.delay(1000 + Math.random() * 2000); // 1-3 seconds
        }
        
        // Add delay between sites
        await this.delay(2000);
        
      } catch (error) {
        console.error(`Error scraping ${siteName}:`, error);
      }
    }

    return allProperties;
  }

  async searchSimilarProperties(targetProperty: {
    area?: number;
    bedrooms?: number;
    district?: string;
    propertyType?: string;
    priceRange?: { min: number; max: number };
  }): Promise<ScrapedProperty[]> {
    const searchParams = {
      location: targetProperty.district,
      propertyType: targetProperty.propertyType,
      minPrice: targetProperty.priceRange?.min,
      maxPrice: targetProperty.priceRange?.max,
      maxProperties: 20
    };

    const properties = await this.scrapeMultipleSites(searchParams);
    
    // Filter by similarity
    return properties.filter(prop => {
      if (targetProperty.area && prop.area) {
        const areaDiff = Math.abs(prop.area - targetProperty.area) / targetProperty.area;
        if (areaDiff > 0.3) return false; // More than 30% difference
      }
      
      if (targetProperty.bedrooms && prop.bedrooms) {
        if (Math.abs(prop.bedrooms - targetProperty.bedrooms) > 1) return false;
      }
      
      return true;
    });
  }
}

export const realEstateScraper = new RealEstateScraper();
export { RealEstateScraper };
export type { ScrapedProperty };