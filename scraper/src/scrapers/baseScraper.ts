import Hero from '@ulixee/hero-playground';
import { ScrapedProperty, ScraperConfig, ScraperResult, HeroConfig } from '../types';
import { DataProcessor } from '../utils/dataProcessor';
import { PropertyService } from '../database/propertyService';
import { heroConfig, globalConfig } from '../config/scrapers';

export abstract class BaseScraper {
  protected hero: Hero | null = null;
  protected config: ScraperConfig;
  protected heroConfig: HeroConfig;
  protected propertyService: PropertyService;
  protected scrapedProperties: ScrapedProperty[] = [];
  protected errors: string[] = [];
  protected startTime: Date = new Date();

  constructor(config: ScraperConfig) {
    this.config = config;
    this.heroConfig = heroConfig;
    this.propertyService = new PropertyService();
  }

  /**
   * Initialize Hero.js instance with stealth configuration
   */
  protected async initializeHero(): Promise<void> {
    try {
      this.hero = new Hero({
        userAgent: this.getRandomUserAgent(),
        viewport: this.getRandomViewport(),
        showChrome: false,
      });

      // Set up request interception for blocking ads and analytics
      if (this.heroConfig.blockAds || this.heroConfig.blockAnalytics) {
        await this.hero.goto('about:blank');
        // Additional stealth configurations can be added here
      }

      console.log(`Hero.js initialized for ${this.config.name}`);
    } catch (error) {
      console.error('Failed to initialize Hero.js:', error);
      throw error;
    }
  }

  /**
   * Get random user agent for rotation
   */
  protected getRandomUserAgent(): string {
    const userAgents = globalConfig.userAgents;
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  /**
   * Get random viewport for rotation
   */
  protected getRandomViewport(): { width: number; height: number } {
    const viewports = globalConfig.viewports;
    return viewports[Math.floor(Math.random() * viewports.length)];
  }

  /**
   * Navigate to URL with retry logic
   */
  protected async navigateWithRetry(url: string, retries: number = this.config.retries): Promise<boolean> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!this.hero) {
          await this.initializeHero();
        }

        console.log(`Navigating to: ${url} (Attempt ${attempt}/${retries})`);
        await this.hero!.goto(url, { timeoutMs: this.config.timeout });
        
        // Wait for page to load
        await this.hero!.waitForPaintingStable();
        
        return true;
      } catch (error) {
        console.error(`Navigation attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          this.errors.push(`Failed to navigate to ${url}: ${error}`);
          return false;
        }
        
        // Wait before retry
        await DataProcessor.delay(2000, 5000);
      }
    }
    
    return false;
  }

  /**
   * Wait for element with timeout
   */
  protected async waitForElement(selector: string, timeout: number = 10000): Promise<boolean> {
    try {
      if (!this.hero) return false;
      
      // TODO: Implement proper waitForElement with Hero.js v2 API
      await DataProcessor.delay(1000, 2000); // Temporary delay
      return true;
    } catch (error) {
      console.error(`Element not found: ${selector}`, error);
      return false;
    }
  }

  /**
   * Extract text content safely
   */
  protected async extractText(selector: string): Promise<string> {
    try {
      if (!this.hero) return '';
      
      const element = await this.hero.document.querySelector(selector);
      if (element) {
        const text = await element.textContent;
        return DataProcessor.cleanText(text || '');
      }
    } catch (error) {
      console.error(`Error extracting text from ${selector}:`, error);
    }
    
    return '';
  }

  /**
   * Extract attribute safely
   */
  protected async extractAttribute(selector: string, attribute: string): Promise<string> {
    try {
      if (!this.hero) return '';
      
      const element = await this.hero.document.querySelector(selector);
      if (element) {
        const attr = await element.getAttribute(attribute);
        return attr || '';
      }
    } catch (error) {
      console.error(`Error extracting attribute ${attribute} from ${selector}:`, error);
    }
    
    return '';
  }

  /**
   * Extract multiple elements
   */
  protected async extractElements(selector: string): Promise<any[]> {
    try {
      if (!this.hero) return [];
      
      const elements = await this.hero.document.querySelectorAll(selector);
      return Array.from(elements);
    } catch (error) {
      console.error(`Error extracting elements ${selector}:`, error);
      return [];
    }
  }

  /**
   * Scroll page to load more content
   */
  protected async scrollToLoadMore(maxScrolls: number = 3): Promise<void> {
    try {
      if (!this.hero) return;
      
      for (let i = 0; i < maxScrolls; i++) {
        // TODO: Implement proper scrolling with Hero.js v2 API
        await DataProcessor.delay(1000, 2000); // Temporary delay for scroll simulation
        await DataProcessor.delay(1000, 2000);
        
        // Check if new content loaded
        await this.hero.waitForPaintingStable();
      }
    } catch (error) {
      console.error('Error during scrolling:', error);
    }
  }

  /**
   * Handle pagination
   */
  protected async handlePagination(maxPages: number = this.config.maxPages || 5): Promise<string[]> {
    const urls: string[] = [];
    
    try {
      if (!this.hero) return urls;
      
      // Extract pagination URLs - this should be implemented by child classes
      const paginationLinks = await this.extractPaginationLinks();
      
      return paginationLinks.slice(0, maxPages);
    } catch (error) {
      console.error('Error handling pagination:', error);
      return urls;
    }
  }

  /**
   * Extract pagination links - to be implemented by child classes
   */
  protected abstract extractPaginationLinks(): Promise<string[]>;

  /**
   * Extract property data from current page - to be implemented by child classes
   */
  protected abstract extractPropertyData(): Promise<ScrapedProperty[]>;

  /**
   * Get property listing URLs from current page - to be implemented by child classes
   */
  protected abstract extractPropertyUrls(): Promise<string[]>;

  /**
   * Main scraping method
   */
  async scrape(startUrl: string, maxProperties: number = this.config.maxProperties || 50): Promise<ScraperResult> {
    this.startTime = new Date();
    this.scrapedProperties = [];
    this.errors = [];

    try {
      console.log(`Starting scrape for ${this.config.name}`);
      console.log(`Target: ${maxProperties} properties from ${startUrl}`);

      await this.initializeHero();
      
      // Navigate to start URL
      const navigated = await this.navigateWithRetry(startUrl);
      if (!navigated) {
        throw new Error(`Failed to navigate to start URL: ${startUrl}`);
      }

      // Get pagination URLs
      const pageUrls = await this.handlePagination();
      pageUrls.unshift(startUrl); // Include the first page

      console.log(`Found ${pageUrls.length} pages to scrape`);

      // Scrape each page
      for (const pageUrl of pageUrls) {
        if (this.scrapedProperties.length >= maxProperties) {
          console.log(`Reached target of ${maxProperties} properties`);
          break;
        }

        console.log(`Scraping page: ${pageUrl}`);
        
        const navigated = await this.navigateWithRetry(pageUrl);
        if (!navigated) {
          this.errors.push(`Failed to navigate to page: ${pageUrl}`);
          continue;
        }

        // Extract properties from current page
        const pageProperties = await this.extractPropertyData();
        
        for (const property of pageProperties) {
          if (this.scrapedProperties.length >= maxProperties) break;
          
          // Validate property data
          if (DataProcessor.validateProperty(property)) {
            this.scrapedProperties.push(property);
            
            // Store in database
            try {
              await this.propertyService.insertProperty(property);
              console.log(`Stored property: ${property.title}`);
            } catch (dbError) {
              console.error('Database error:', dbError);
              this.errors.push(`Database error for ${property.title}: ${dbError}`);
            }
          } else {
            this.errors.push(`Invalid property data: ${property.title}`);
          }
        }

        // Delay between pages
        await DataProcessor.delay(this.config.delayMin, this.config.delayMax);
      }

    } catch (error) {
      console.error('Scraping error:', error);
      this.errors.push(`Scraping error: ${error}`);
    } finally {
      await this.cleanup();
    }

    const duration = Date.now() - this.startTime.getTime();
    
    const result: ScraperResult = {
      success: this.scrapedProperties.length > 0,
      propertiesScraped: this.scrapedProperties.length,
      errors: this.errors,
      duration,
      source: this.config.name,
    };

    console.log(`Scraping completed for ${this.config.name}:`, result);
    return result;
  }

  /**
   * Cleanup resources
   */
  protected async cleanup(): Promise<void> {
    try {
      if (this.hero) {
        await this.hero.close();
        this.hero = null;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Get scraped properties
   */
  getScrapedProperties(): ScrapedProperty[] {
    return this.scrapedProperties;
  }

  /**
   * Get scraping errors
   */
  getErrors(): string[] {
    return this.errors;
  }
}