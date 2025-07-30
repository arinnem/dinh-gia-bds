import { FirecrawlBaseScraper } from './firecrawlBaseScraper';
import * as cheerio from 'cheerio';

export class FirecrawlAlonhadatScraper extends FirecrawlBaseScraper {
  protected async extractPropertyUrls(html: string, pageUrl: string): Promise<string[]> {
    if (this.config.debug) {
      console.log('[Firecrawl] HTML preview:', html.slice(0, 2000));
    }
    const $ = cheerio.load(html);
    const urls: string[] = [];
    $('#left > div.list-property-box > div > div.ct_title_box.title > div.ct_title > a').each((_, el) => {
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
    const title = $('.main-title, h1').first().text().trim();
    const price = $('.price').first().text().trim();
    const area = $('.area').first().text().trim();
    const address = $('.address-full').first().text().trim();
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