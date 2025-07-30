import { FirecrawlBaseScraper } from './firecrawlBaseScraper';
import * as cheerio from 'cheerio';

export class FirecrawlNhadat24hScraper extends FirecrawlBaseScraper {
  protected async extractPropertyUrls(html: string, pageUrl: string): Promise<string[]> {
    if (this.config.debug) {
      console.log('[Firecrawl] HTML preview:', html);
    }
    const $ = cheerio.load(html);
    const urls: string[] = [];
    // Try robust selectors for property links
    $('.product-listing .product-title a, .product-title a, .listing-title a, .pn1 a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('#')) {
        const fullUrl = href.startsWith('http') ? href : new URL(href, pageUrl).href;
        if (!urls.includes(fullUrl)) urls.push(fullUrl);
      }
    });
    if (this.config.debug) {
      console.log('[Firecrawl] Property URLs found:', urls);
    }
    return urls;
  }

  protected async extractPropertyDataFromPage(html: string, url: string): Promise<any> {
    const $ = cheerio.load(html);
    // Try robust selectors for property details
    const title = $('.main-title, h1, .product-title').first().text().trim();
    const price = $('.price, .product-price, .gia-title').first().text().trim();
    const area = $('.area, .product-area, .dientich-title').first().text().trim();
    const address = $('.address-full, .product-address, .address-title').first().text().trim();
    return {
      title,
      price,
      area,
      address,
      url,
      source: this.config.name,
      scrapedAt: new Date().toISOString(),
    };
  }
} 