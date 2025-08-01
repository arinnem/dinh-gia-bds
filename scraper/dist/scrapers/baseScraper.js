"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseScraper = void 0;
const hero_playground_1 = __importDefault(require("@ulixee/hero-playground"));
const dataProcessor_1 = require("../utils/dataProcessor");
const propertyService_1 = require("../database/propertyService");
const scrapers_1 = require("../config/scrapers");
class BaseScraper {
    constructor(config) {
        this.hero = null;
        this.scrapedProperties = [];
        this.errors = [];
        this.startTime = new Date();
        this.config = config;
        this.heroConfig = scrapers_1.heroConfig;
        this.propertyService = new propertyService_1.PropertyService();
    }
    /**
     * Initialize Hero.js instance with stealth configuration
     */
    async initializeHero() {
        try {
            this.hero = new hero_playground_1.default({
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
        }
        catch (error) {
            console.error('Failed to initialize Hero.js:', error);
            throw error;
        }
    }
    /**
     * Get random user agent for rotation
     */
    getRandomUserAgent() {
        const userAgents = scrapers_1.globalConfig.userAgents;
        return userAgents[Math.floor(Math.random() * userAgents.length)];
    }
    /**
     * Get random viewport for rotation
     */
    getRandomViewport() {
        const viewports = scrapers_1.globalConfig.viewports;
        return viewports[Math.floor(Math.random() * viewports.length)];
    }
    /**
     * Navigate to URL with retry logic
     */
    async navigateWithRetry(url, retries = this.config.retries) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                if (!this.hero) {
                    await this.initializeHero();
                }
                console.log(`Navigating to: ${url} (Attempt ${attempt}/${retries})`);
                await this.hero.goto(url, { timeoutMs: this.config.timeout });
                // Wait for page to load
                await this.hero.waitForPaintingStable();
                return true;
            }
            catch (error) {
                console.error(`Navigation attempt ${attempt} failed:`, error);
                if (attempt === retries) {
                    this.errors.push(`Failed to navigate to ${url}: ${error}`);
                    return false;
                }
                // Wait before retry
                await dataProcessor_1.DataProcessor.delay(2000, 5000);
            }
        }
        return false;
    }
    /**
     * Wait for element with timeout
     */
    async waitForElement(selector, timeout = 10000) {
        try {
            if (!this.hero)
                return false;
            // TODO: Implement proper waitForElement with Hero.js v2 API
            await dataProcessor_1.DataProcessor.delay(1000, 2000); // Temporary delay
            return true;
        }
        catch (error) {
            console.error(`Element not found: ${selector}`, error);
            return false;
        }
    }
    /**
     * Extract text content safely
     */
    async extractText(selector) {
        try {
            if (!this.hero)
                return '';
            const element = await this.hero.document.querySelector(selector);
            if (element) {
                const text = await element.textContent;
                return dataProcessor_1.DataProcessor.cleanText(text || '');
            }
        }
        catch (error) {
            console.error(`Error extracting text from ${selector}:`, error);
        }
        return '';
    }
    /**
     * Extract attribute safely
     */
    async extractAttribute(selector, attribute) {
        try {
            if (!this.hero)
                return '';
            const element = await this.hero.document.querySelector(selector);
            if (element) {
                const attr = await element.getAttribute(attribute);
                return attr || '';
            }
        }
        catch (error) {
            console.error(`Error extracting attribute ${attribute} from ${selector}:`, error);
        }
        return '';
    }
    /**
     * Extract multiple elements
     */
    async extractElements(selector) {
        try {
            if (!this.hero)
                return [];
            const elements = await this.hero.document.querySelectorAll(selector);
            return Array.from(elements);
        }
        catch (error) {
            console.error(`Error extracting elements ${selector}:`, error);
            return [];
        }
    }
    /**
     * Scroll page to load more content
     */
    async scrollToLoadMore(maxScrolls = 3) {
        try {
            if (!this.hero)
                return;
            for (let i = 0; i < maxScrolls; i++) {
                // TODO: Implement proper scrolling with Hero.js v2 API
                await dataProcessor_1.DataProcessor.delay(1000, 2000); // Temporary delay for scroll simulation
                await dataProcessor_1.DataProcessor.delay(1000, 2000);
                // Check if new content loaded
                await this.hero.waitForPaintingStable();
            }
        }
        catch (error) {
            console.error('Error during scrolling:', error);
        }
    }
    /**
     * Handle pagination
     */
    async handlePagination(maxPages = this.config.maxPages || 5) {
        const urls = [];
        try {
            if (!this.hero)
                return urls;
            // Extract pagination URLs - this should be implemented by child classes
            const paginationLinks = await this.extractPaginationLinks();
            return paginationLinks.slice(0, maxPages);
        }
        catch (error) {
            console.error('Error handling pagination:', error);
            return urls;
        }
    }
    /**
     * Main scraping method
     */
    async scrape(startUrl, maxProperties = this.config.maxProperties || 50) {
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
                    if (this.scrapedProperties.length >= maxProperties)
                        break;
                    // Validate property data
                    if (dataProcessor_1.DataProcessor.validateProperty(property)) {
                        this.scrapedProperties.push(property);
                        // Store in database
                        try {
                            await this.propertyService.insertProperty(property);
                            console.log(`Stored property: ${property.title}`);
                        }
                        catch (dbError) {
                            console.error('Database error:', dbError);
                            this.errors.push(`Database error for ${property.title}: ${dbError}`);
                        }
                    }
                    else {
                        this.errors.push(`Invalid property data: ${property.title}`);
                    }
                }
                // Delay between pages
                await dataProcessor_1.DataProcessor.delay(this.config.delayMin, this.config.delayMax);
            }
        }
        catch (error) {
            console.error('Scraping error:', error);
            this.errors.push(`Scraping error: ${error}`);
        }
        finally {
            await this.cleanup();
        }
        const duration = Date.now() - this.startTime.getTime();
        const result = {
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
    async cleanup() {
        try {
            if (this.hero) {
                await this.hero.close();
                this.hero = null;
            }
        }
        catch (error) {
            console.error('Error during cleanup:', error);
        }
    }
    /**
     * Get scraped properties
     */
    getScrapedProperties() {
        return this.scrapedProperties;
    }
    /**
     * Get scraping errors
     */
    getErrors() {
        return this.errors;
    }
}
exports.BaseScraper = BaseScraper;
//# sourceMappingURL=baseScraper.js.map