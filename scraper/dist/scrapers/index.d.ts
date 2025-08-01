import { BatDongSanScraper } from './batdongsanScraper';
import { NhaScraper } from './nhaScraper';
import { AlonhadatScraper } from './alonhadatScraper';
import { ScraperResult, ScrapingSession } from '../types';
export declare class ScraperOrchestrator {
    private scrapers;
    private dbConnection;
    private session;
    constructor();
    /**
     * Generate unique session ID
     */
    private generateSessionId;
    /**
     * Test database connection
     */
    testDatabaseConnection(): Promise<boolean>;
    /**
     * Run all scrapers sequentially
     */
    runAllScrapers(propertiesPerSite?: number): Promise<ScrapingSession>;
    /**
     * Run specific scraper
     */
    runScraper(scraperName: string, maxProperties?: number): Promise<ScraperResult>;
    /**
     * Get available scrapers
     */
    getAvailableScrapers(): string[];
    /**
     * Get current session info
     */
    getCurrentSession(): ScrapingSession;
    /**
     * Log session summary
     */
    private logSessionSummary;
    /**
     * Save session to database
     */
    private saveSessionToDatabase;
    /**
     * Create scraping sessions table
     */
    private createSessionTable;
    /**
     * Cleanup resources
     */
    cleanup(): Promise<void>;
}
export { BatDongSanScraper, NhaScraper, AlonhadatScraper };
//# sourceMappingURL=index.d.ts.map