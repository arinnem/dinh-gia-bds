import { BaseScraper } from './baseScraper';
import { ScrapedProperty } from '../types';
export declare class NhaScraper extends BaseScraper {
    constructor();
    /**
     * Extract pagination links from Nha.com.vn
     */
    protected extractPaginationLinks(): Promise<string[]>;
    /**
     * Extract property URLs from current page
     */
    protected extractPropertyUrls(): Promise<string[]>;
    /**
     * Validate if URL is a valid property listing
     */
    private isValidPropertyUrl;
    /**
     * Extract property data from current page
     */
    protected extractPropertyData(): Promise<ScrapedProperty[]>;
    /**
     * Scrape individual property from its detail page
     */
    private scrapeIndividualProperty;
    /**
     * Scrape property data from current page
     */
    private scrapeCurrentPageProperty;
    /**
     * Start scraping Nha.com.vn
     */
    startScraping(maxProperties?: number): Promise<void>;
}
//# sourceMappingURL=nhaScraper.d.ts.map