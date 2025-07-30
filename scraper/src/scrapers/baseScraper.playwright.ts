import { Browser, Page, chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

export interface ScrapedProperty {
  title: string;
  description: string;
  price: { amount: number; currency: string; unit: string; negotiable?: boolean };
  area: { total: number; unit: string };
  features: { bedrooms?: number; bathrooms?: number; floors?: number };
  address: {
    full: string;
    district?: string;
    ward?: string;
    coordinates?: { lat: number; lng: number };
  };
  propertyType: string;
  legalStatus: string;
  direction: string;
  projectName: string;
  images: string[];
  contact: { name?: string; phone?: string; email?: string };
  url: string;
  source: string;
  scrapedAt: string;
  postedDate?: string;
  hash: string;
}

export interface ScraperConfig {
  name: string;
  baseUrl: string;
  retries?: number;
  timeout?: number;
  delayMin?: number;
  delayMax?: number;
  maxPages?: number;
  maxProperties?: number;
  debug?: boolean;
}

export abstract class BaseScraper {
  protected browser: Browser | null = null;
  protected page: Page | null = null;
  protected config: ScraperConfig;
  protected errors: string[] = [];
  protected debug: boolean;

  constructor(config: ScraperConfig) {
    this.config = config;
    this.debug = !!config.debug;
  }

  protected log(...args: any[]) {
    if (this.debug) {
      console.log('[Scraper]', ...args);
    }
  }

  protected async initializeBrowser(): Promise<void> {
    this.log('Launching browser...');
    let userAgent = undefined;
    let viewport = undefined;
    if (this.debug) {
      userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      viewport = { width: 1280, height: 800 };
    }
    this.browser = await chromium.launch({ headless: !this.debug });
    const context = await this.browser.newContext({ userAgent, viewport });
    this.page = await context.newPage();
    // Simulate mouse movement
    if (this.debug) {
      await this.page.mouse.move(100, 100);
      await this.page.mouse.move(200, 200);
      // Load cookies if cookies.json exists
      const cookiesPath = path.resolve(__dirname, '../../cookies.json');
      if (fs.existsSync(cookiesPath)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf-8'));
        await this.page.context().addCookies(cookies);
        this.log('Loaded cookies from cookies.json');
      }
    }
    this.log('Browser launched.');
  }

  protected async navigateWithRetry(url: string, retries: number = 3): Promise<boolean> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        if (!this.page) await this.initializeBrowser();
        this.log(`Navigating to ${url} (attempt ${attempt})`);
        await this.page!.goto(url, { timeout: this.config.timeout || 30000 });
        this.log(`Navigation to ${url} successful.`);
        return true;
      } catch (error) {
        this.log(`Navigation to ${url} failed:`, error);
        if (attempt === retries) {
          this.errors.push(`Failed to navigate to ${url}: ${error}`);
          return false;
        }
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    return false;
  }

  protected async extractText(selector: string): Promise<string> {
    if (!this.page) return '';
    try {
      const text = (await this.page.textContent(selector))?.trim() || '';
      this.log(`Extracted text from ${selector}:`, text);
      return text;
    } catch (err) {
      this.log(`Failed to extract text from ${selector}:`, err);
      return '';
    }
  }

  protected async extractAttribute(selector: string, attribute: string): Promise<string> {
    if (!this.page) return '';
    try {
      const attr = (await this.page.getAttribute(selector, attribute)) || '';
      this.log(`Extracted attribute ${attribute} from ${selector}:`, attr);
      return attr;
    } catch (err) {
      this.log(`Failed to extract attribute ${attribute} from ${selector}:`, err);
      return '';
    }
  }

  protected async extractNumber(selector: string): Promise<number | undefined> {
    const text = await this.extractText(selector);
    const num = parseFloat(text.replace(/[^ -9.]/g, ''));
    this.log(`Parsed number from ${selector}:`, num);
    return isNaN(num) ? undefined : num;
  }

  protected async extractArray(selector: string, attribute?: string): Promise<string[]> {
    if (!this.page) return [];
    try {
      let arr: string[];
      if (attribute) {
        arr = await this.page.$$eval(selector, (els: any[], attr: string) =>
          els.map(e => e.getAttribute(attr) || '').filter(Boolean), attribute
        );
      } else {
        arr = await this.page.$$eval(selector, (els: any[]) =>
          els.map(e => e.textContent?.trim() || '').filter(Boolean)
        );
      }
      this.log(`Extracted array from ${selector}:`, arr);
      return arr;
    } catch (err) {
      this.log(`Failed to extract array from ${selector}:`, err);
      return [];
    }
  }

  protected async extractBoolean(selector: string): Promise<boolean | undefined> {
    if (!this.page) return undefined;
    try {
      const text = (await this.page.textContent(selector))?.toLowerCase() || '';
      if (text.includes('có thương lượng') || text.includes('thương lượng') || text.includes('yes') || text.includes('true')) {
        return true;
      }
      if (text.includes('không thương lượng') || text.includes('no') || text.includes('false')) {
        return false;
      }
      // Check for checkbox
      const el = await this.page.$(selector);
      if (el) {
        const checked = await el.getAttribute('checked');
        if (checked !== null) return true;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  protected async delay(min: number = 1000, max: number = 2000): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(res => setTimeout(res, ms));
  }

  protected abstract extractPaginationLinks(): Promise<string[]>;
  protected abstract extractPropertyUrls(): Promise<string[]>;
  protected abstract extractPropertyDataFromPage(url: string): Promise<Partial<ScrapedProperty>>;

  async scrape(startUrl: string, maxProperties: number = 50): Promise<ScrapedProperty[]> {
    await this.initializeBrowser();
    const result: ScrapedProperty[] = [];
    const visited = new Set<string>();

    const navigated = await this.navigateWithRetry(startUrl);
    if (!navigated) return result;

    const pageUrls = await this.extractPaginationLinks();
    pageUrls.unshift(startUrl);

    for (const pageUrl of pageUrls) {
      if (result.length >= maxProperties) break;
      await this.navigateWithRetry(pageUrl);
      const propertyUrls = await this.extractPropertyUrls();
      for (const url of propertyUrls) {
        if (result.length >= maxProperties) break;
        if (visited.has(url)) continue;
        visited.add(url);
        const property = await this.extractPropertyDataFromPage(url);
        if (property && property.title && property.price && property.area && property.address) {
          result.push({
            ...property,
            url,
            source: this.config.name,
            scrapedAt: new Date().toISOString(),
          } as ScrapedProperty);
        }
        await this.delay(this.config.delayMin, this.config.delayMax);
      }
    }
    await this.cleanup();
    return result;
  }

  protected async cleanup(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.browser) await this.browser.close();
  }
} 