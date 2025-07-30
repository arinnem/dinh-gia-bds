import axios from 'axios';

export interface FirecrawlScraperConfig {
  name: string;
  baseUrl: string;
  debug?: boolean;
}

export abstract class FirecrawlBaseScraper {
  protected config: FirecrawlScraperConfig;
  protected apiKey: string;
  protected maxProperties: number;

  constructor(config: FirecrawlScraperConfig) {
    this.config = config;
    this.apiKey = process.env.FIRECRAWL_API_KEY || '';
    this.maxProperties = parseInt(process.env.FIRECRAWL_MAX_PROPERTIES || '5', 10);
    if (!this.apiKey) throw new Error('FIRECRAWL_API_KEY not set in environment');
  }

  protected async firecrawlScrape(url: string): Promise<any> {
    const response = await axios.post(
      'https://api.firecrawl.dev/v1/scrape',
      {
        url,
        formats: ['html'],
        onlyMainContent: false,
        maxAge: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    return response.data;
  }

  async scrape(startUrl: string): Promise<any[]> {
    if (this.config.debug) console.log('[Firecrawl] Scraping:', startUrl);
    const pageData = await this.firecrawlScrape(startUrl);
    const html = pageData?.data?.html || '';
    const propertyUrls = await this.extractPropertyUrls(html, startUrl);
    if (this.config.debug) console.log('[Firecrawl] Found', propertyUrls.length, 'property URLs. Sample:', propertyUrls.slice(0, 5));
    const results = [];
    for (const url of propertyUrls.slice(0, this.maxProperties)) {
      const propData = await this.scrapeProperty(url);
      if (propData) results.push(propData);
    }
    return results;
  }

  protected abstract extractPropertyUrls(html: string, pageUrl: string): Promise<string[]>;
  protected abstract extractPropertyDataFromPage(html: string, url: string): Promise<any>;

  async scrapeProperty(url: string): Promise<any> {
    if (this.config.debug) console.log('[Firecrawl] Scraping property:', url);
    const pageData = await this.firecrawlScrape(url);
    const html = pageData?.data?.html || '';
    return this.extractPropertyDataFromPage(html, url);
  }
} 