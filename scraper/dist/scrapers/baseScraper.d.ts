import Hero from '@ulixee/hero-playground';
import { ScrapedProperty, ScraperConfig, ScraperResult, HeroConfig } from '../types';
import { PropertyService } from '../database/propertyService';
export declare abstract class BaseScraper {
    protected hero: Hero | null;
    protected config: ScraperConfig;
    protected heroConfig: HeroConfig;
    protected propertyService: PropertyService;
    protected scrapedProperties: ScrapedProperty[];
    protected errors: string[];
    protected startTime: Date;
    constructor(config: ScraperConfig);
    /**
     * Initialize Hero.js instance with stealth configuration
     */
    protected initializeHero(): Promise<void>;
    /**
     * Get random user agent for rotation
     */
    protected getRandomUserAgent(): string;
    /**
     * Get random viewport for rotation
     */
    protected getRandomViewport(): {
        width: number;
        height: number;
    };
    /**
     * Navigate to URL with retry logic
     */
    protected navigateWithRetry(url: string, retries?: number): Promise<boolean>;
    /**
     * Wait for element with timeout
     */
    protected waitForElement(selector: string, timeout?: number): Promise<boolean>;
    /**
     * Extract text content safely
     */
    protected extractText(selector: string): Promise<string>;
    /**
     * Extract attribute safely
     */
    protected extractAttribute(selector: string, attribute: string): Promise<string>;
    /**
     * Extract multiple elements
     */
    protected extractElements(selector: string): Promise<any[]>;
    /**
     * Scroll page to load more content
     */
    protected scrollToLoadMore(maxScrolls?: number): Promise<void>;
    /**
     * Handle pagination
     */
    protected handlePagination(maxPages?: number): Promise<string[]>;
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
    scrape(startUrl: string, maxProperties?: number): Promise<ScraperResult>;
    /**
     * Cleanup resources
     */
    protected cleanup(): Promise<void>;
    /**
     * Get scraped properties
     */
    getScrapedProperties(): ScrapedProperty[];
    /**
     * Get scraping errors
     */
    getErrors(): string[];
}
//# sourceMappingURL=baseScraper.d.ts.map