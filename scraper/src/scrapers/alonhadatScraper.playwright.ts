import { BaseScraper, ScrapedProperty } from './baseScraper.playwright';

export class AlonhadatScraper extends BaseScraper {
  constructor(config: any) {
    super(config);
  }

  protected async extractPaginationLinks(): Promise<string[]> {
    if (!this.page) return [];
    const urls: string[] = [];
    const paginationSelector = '.pagination a, .paging a, .page-numbers a, .next, .page-link';
    const elements = await this.page.$$(paginationSelector);
    for (const el of elements) {
      const href = await el.getAttribute('href');
      if (href && (href.includes('/page-') || href.includes('?page=') || href.includes('/p'))) {
        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
        if (!urls.includes(fullUrl)) urls.push(fullUrl);
      }
    }
    // Manual fallback
    const currentUrl = this.page.url().split('?')[0].replace(/\/page-\d+/, '');
    for (let page = 2; page <= (this.config.maxPages || 5); page++) {
      const pageUrl = `${currentUrl}/page-${page}`;
      if (!urls.includes(pageUrl)) urls.push(pageUrl);
    }
    return urls.slice(0, this.config.maxPages || 5);
  }

  protected async extractPropertyUrls(): Promise<string[]> {
    if (!this.page) return [];
    const urls: string[] = [];
    const linkSelectors = [
      '.content-item a[href*="/ban-"]',
      '.content-item a[href*="/cho-thue-"]',
      '.item-title a',
      '.property-item a',
      '.listing-item a',
      'a[href*="alonhadat.com.vn"][href*="/ban-"]',
      'a[href*="alonhadat.com.vn"][href*="/cho-thue-"]',
      '.ct_title a',
      '.title a'
    ];
    for (const selector of linkSelectors) {
      const elements = await this.page.$$(selector);
      for (const el of elements) {
        const href = await el.getAttribute('href');
        if (href) {
          const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
          if (!urls.includes(fullUrl)) urls.push(fullUrl);
        }
      }
    }
    return urls;
  }

  protected async extractPropertyDataFromPage(url: string): Promise<Partial<ScrapedProperty>> {
    await this.navigateWithRetry(url);
    const price = {
      amount: await this.extractNumber('.price') || 0,
      currency: await this.extractText('.price-currency') || '',
      unit: await this.extractText('.price-unit') || '',
      negotiable: await this.extractBoolean('.price-negotiable')
    };
    const area = {
      total: await this.extractNumber('.area') || 0,
      unit: await this.extractText('.area-unit') || ''
    };
    const features = {
      bedrooms: await this.extractNumber('.bedrooms'),
      bathrooms: await this.extractNumber('.bathrooms'),
      floors: await this.extractNumber('.floors')
    };
    const address = {
      full: await this.extractText('.address-full') || '',
      district: await this.extractText('.address-district') || undefined,
      ward: await this.extractText('.address-ward') || undefined,
      coordinates: undefined // Add coordinate extraction if available
    };
    const contact = {
      name: await this.extractText('.contact-name') || undefined,
      phone: await this.extractText('.contact-phone') || undefined,
      email: await this.extractText('.contact-email') || undefined
    };
    return {
      title: await this.extractText('.main-title') || '',
      description: await this.extractText('.main-description') || '',
      price,
      area,
      features,
      address,
      propertyType: await this.extractText('.property-type') || '',
      legalStatus: await this.extractText('.legal-status') || '',
      direction: await this.extractText('.direction') || '',
      projectName: await this.extractText('.project-name') || '',
      images: await this.extractArray('.property-image', 'src'),
      contact,
      url: this.page?.url() || '',
      source: this.config.name,
      scrapedAt: new Date().toISOString(),
      postedDate: await this.extractText('.posted-date') || undefined,
      hash: '' // To be filled in runner
    };
  }
} 