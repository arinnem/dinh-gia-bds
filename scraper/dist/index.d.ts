#!/usr/bin/env node
/**
 * Main scraping application
 */
declare class ScrapingApp {
    private orchestrator;
    constructor();
    /**
     * Display help information
     */
    private displayHelp;
    /**
     * Parse command line arguments
     */
    private parseArgs;
    /**
     * Test database connection
     */
    private testDatabase;
    /**
     * List available scrapers
     */
    private listScrapers;
    /**
     * Validate environment variables
     */
    private validateEnvironment;
    /**
     * Run the application
     */
    run(): Promise<void>;
}
export { ScrapingApp };
//# sourceMappingURL=index.d.ts.map