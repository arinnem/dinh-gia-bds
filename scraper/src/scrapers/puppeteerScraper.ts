import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapedProperty, ScraperResult } from '../types';
import { DataProcessor } from '../utils/dataProcessor';
import { PropertyService } from '../database/propertyService';

export class PuppeteerScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  async initialize(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      this.page = await this.browser.newPage();
      
      // Set user agent
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await this.page.setViewport({ width: 1366, height: 768 });
      
      console.log('Puppeteer initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Puppeteer:', error);
      throw error;
    }
  }

  async scrapeBatDongSan(maxProperties: number = 50): Promise<ScraperResult> {
    const startTime = new Date();
    const scrapedProperties: ScrapedProperty[] = [];
    const errors: string[] = [];

    try {
      if (!this.page) {
        await this.initialize();
      }

      console.log('Starting BatDongSan.com.vn scraping...');
      
      // Navigate to the main page
      const baseUrl = 'https://batdongsan.com.vn/nha-dat-ban';
      await this.page!.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      console.log('Page loaded, extracting property links...');
      
      // Extract property links
      const propertyLinks = await this.page!.evaluate(() => {
        const links: string[] = [];
        const linkElements = document.querySelectorAll('a[href*="/nha-dat-ban/"]');
        
        linkElements.forEach((link) => {
          const href = (link as HTMLAnchorElement).href;
          if (href && href.includes('/nha-dat-ban/') && !links.includes(href)) {
            links.push(href);
          }
        });
        
        return links.slice(0, 50); // Limit to 50 links
      });

      console.log(`Found ${propertyLinks.length} property links`);

      // Scrape each property
      for (let i = 0; i < Math.min(propertyLinks.length, maxProperties); i++) {
        try {
          const propertyUrl = propertyLinks[i];
          console.log(`Scraping property ${i + 1}/${Math.min(propertyLinks.length, maxProperties)}: ${propertyUrl}`);
          
          const property = await this.scrapePropertyDetails(propertyUrl);
          if (property) {
            scrapedProperties.push(property);
            
            // Save to database
            try {
              await this.propertyService.insertProperty(property);
              console.log(`✅ Property ${i + 1} saved to database`);
            } catch (dbError) {
              console.error(`❌ Failed to save property ${i + 1} to database:`, dbError);
              errors.push(`Database error for property ${i + 1}: ${dbError}`);
            }
          }
          
          // Add delay between requests
          await DataProcessor.delay(1000, 3000);
        } catch (error) {
          console.error(`Error scraping property ${i + 1}:`, error);
          errors.push(`Property ${i + 1} error: ${error}`);
        }
      }

    } catch (error) {
      console.error('Scraping error:', error);
      errors.push(`Scraping error: ${error}`);
    }

    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    return {
      success: scrapedProperties.length > 0,
      propertiesScraped: scrapedProperties.length,
      errors,
      duration,
      source: 'BatDongSan.com.vn'
    };
  }

  private async scrapePropertyDetails(url: string): Promise<ScrapedProperty | null> {
    try {
      if (!this.page) return null;
      
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const propertyData = await this.page.evaluate(() => {
        // Extract basic information
        const titleElement = document.querySelector('h1, .title, [class*="title"]');
        const title = titleElement?.textContent?.trim() || 'No title';
        
        const priceElement = document.querySelector('[class*="price"], .price, [class*="gia"]');
        const priceText = priceElement?.textContent?.trim() || '0';
        
        const areaElement = document.querySelector('[class*="area"], .area, [class*="dien-tich"]');
        const areaText = areaElement?.textContent?.trim() || '0';
        
        const addressElement = document.querySelector('[class*="address"], .address, [class*="dia-chi"]');
        const address = addressElement?.textContent?.trim() || 'No address';
        
        const descriptionElement = document.querySelector('[class*="description"], .description, [class*="mo-ta"]');
        const description = descriptionElement?.textContent?.trim() || 'No description';
        
        return {
          title,
          priceText,
          areaText,
          address,
          description,
          url: window.location.href
        };
      });
      
      // Process the extracted data
      const property: ScrapedProperty = {
        id: DataProcessor.generateId(),
        url: propertyData.url,
        source: 'BatDongSan.com.vn',
        title: DataProcessor.cleanText(propertyData.title),
        description: DataProcessor.cleanText(propertyData.description),
        price: {
          amount: DataProcessor.extractPrice(propertyData.priceText),
          currency: 'VND',
          unit: 'total'
        },
        area: {
          total: DataProcessor.extractArea(propertyData.areaText),
          unit: 'm2'
        },
        address: {
          full: DataProcessor.cleanText(propertyData.address),
          district: '',
          ward: '',
          street: ''
        },
        features: {
          bedrooms: 0,
          bathrooms: 0,
          floors: 0
        },
        images: [],
        contact: {
          name: '',
          phone: ''
        },
        hash: DataProcessor.generateHash(propertyData.url + propertyData.title)
      };
      
      return property;
    } catch (error) {
      console.error('Error scraping property details:', error);
      return null;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        console.log('Puppeteer browser closed');
      }
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }
}