import { BaseScraper } from './baseScraper';
import { ScrapedProperty } from '../types';
export declare class BatDongSanScraper extends BaseScraper {
    constructor();
    /**
     * Extract pagination links from BatDongSan.com.vn
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
     * Start scraping BatDongSan.com.vn
     */
    startScraping(maxProperties?: number): Promise<void>;
}
//# sourceMappingURL=batdongsanScraper.d.ts.map