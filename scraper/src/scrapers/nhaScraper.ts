import { BaseScraper } from './baseScraper';
import { ScrapedProperty } from '../types';
import { DataProcessor } from '../utils/dataProcessor';
import { scraperConfigs } from '../config/scrapers';

export class NhaScraper extends BaseScraper {
  constructor() {
    super(scraperConfigs.nha);
  }

  /**
   * Extract pagination links from Nha.com.vn
   */
  protected async extractPaginationLinks(): Promise<string[]> {
    const urls: string[] = [];
    
    try {
      if (!this.hero) return urls;
      
      // Nha.com.vn pagination selectors
      const paginationSelector = '.pagination a, .paging a, .page-link, .next-page';
      const paginationElements = await this.extractElements(paginationSelector);
      
      for (const element of paginationElements) {
        try {
          const href = await element.getAttribute('href');
          if (href && (href.includes('page=') || href.includes('/p'))) {
            const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
            if (!urls.includes(fullUrl)) {
              urls.push(fullUrl);
            }
          }
        } catch (error) {
          console.error('Error extracting pagination link:', error);
        }
      }
      
      // Construct pagination URLs manually for Nha.com.vn
      const currentUrl = await this.hero.url;
      const baseUrl = currentUrl.split('?')[0];
      
      for (let page = 2; page <= (this.config.maxPages || 5); page++) {
        const pageUrl = currentUrl.includes('?') 
          ? `${currentUrl}&page=${page}`
          : `${baseUrl}?page=${page}`;
        if (!urls.includes(pageUrl)) {
          urls.push(pageUrl);
        }
      }
      
    } catch (error) {
      console.error('Error extracting pagination links:', error);
    }
    
    return urls.slice(0, this.config.maxPages || 5);
  }

  /**
   * Extract property URLs from current page
   */
  protected async extractPropertyUrls(): Promise<string[]> {
    const urls: string[] = [];
    
    try {
      if (!this.hero) return urls;
      
      // Common selectors for property links on Nha.com.vn
      const linkSelectors = [
        '.listing-item a[href*="/ban/"]',
        '.listing-item a[href*="/thue/"]',
        '.property-item a',
        '.item-title a',
        '.product-item a',
        'a[href*="nha.com.vn"][href*="/ban/"]',
        'a[href*="nha.com.vn"][href*="/thue/"]',
        '.listing-title a',
        '.property-title a'
      ];
      
      for (const selector of linkSelectors) {
        const elements = await this.extractElements(selector);
        
        for (const element of elements) {
          try {
            const href = await element.getAttribute('href');
            if (href) {
              const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
              if (!urls.includes(fullUrl) && this.isValidPropertyUrl(fullUrl)) {
                urls.push(fullUrl);
              }
            }
          } catch (error) {
            console.error('Error extracting property URL:', error);
          }
        }
      }
      
    } catch (error) {
      console.error('Error extracting property URLs:', error);
    }
    
    return urls;
  }

  /**
   * Validate if URL is a valid property listing
   */
  private isValidPropertyUrl(url: string): boolean {
    return (
      url.includes('nha.com.vn') &&
      (url.includes('/ban/') || url.includes('/thue/')) &&
      !url.includes('/tim-kiem') &&
      !url.includes('/dang-tin') &&
      !url.includes('/page=') &&
      !url.includes('/search')
    );
  }

  /**
   * Extract property data from current page
   */
  protected async extractPropertyData(): Promise<ScrapedProperty[]> {
    const properties: ScrapedProperty[] = [];
    
    try {
      if (!this.hero) return properties;
      
      // First try to get property URLs from listing page
      const propertyUrls = await this.extractPropertyUrls();
      
      if (propertyUrls.length > 0) {
        // This is a listing page, scrape individual properties
        console.log(`Found ${propertyUrls.length} property URLs on listing page`);
        
        for (const url of propertyUrls) {
          if (properties.length >= (this.config.maxProperties || 50)) break;
          
          const property = await this.scrapeIndividualProperty(url);
          if (property) {
            properties.push(property);
          }
          
          // Delay between individual property scrapes
          await DataProcessor.delay(1000, 2000);
        }
      } else {
        // This might be an individual property page
        const property = await this.scrapeCurrentPageProperty();
        if (property) {
          properties.push(property);
        }
      }
      
    } catch (error) {
      console.error('Error extracting property data:', error);
    }
    
    return properties;
  }

  /**
   * Scrape individual property from its detail page
   */
  private async scrapeIndividualProperty(url: string): Promise<ScrapedProperty | null> {
    try {
      const navigated = await this.navigateWithRetry(url);
      if (!navigated) {
        console.error(`Failed to navigate to property: ${url}`);
        return null;
      }
      
      return await this.scrapeCurrentPageProperty();
      
    } catch (error) {
      console.error(`Error scraping individual property ${url}:`, error);
      return null;
    }
  }

  /**
   * Scrape property data from current page
   */
  private async scrapeCurrentPageProperty(): Promise<ScrapedProperty | null> {
    try {
      if (!this.hero) return null;
      
      // Extract basic property information
      const title = await this.extractText('h1, .property-title, .listing-title, .detail-title, .item-title');
      if (!title) {
        console.log('No title found, skipping property');
        return null;
      }
      
      const priceText = await this.extractText('.price, .property-price, .listing-price, .gia, .cost');
      const areaText = await this.extractText('.area, .property-area, .listing-area, .dien-tich, .size');
      const address = await this.extractText('.address, .property-address, .listing-address, .dia-chi, .location');
      const description = await this.extractText('.description, .property-description, .listing-description, .mo-ta, .content, .detail-content');
      
      // Extract contact information
      const contactName = await this.extractText('.contact-name, .seller-name, .owner-name, .lien-he .name');
      const contactPhone = await this.extractText('.contact-phone, .seller-phone, .owner-phone, .lien-he .phone, .phone');
      
      // Extract images
      const images: string[] = [];
      const imageElements = await this.extractElements('.property-images img, .listing-images img, .gallery img, .slider img, .photos img');
      
      for (const img of imageElements) {
        try {
          const src = await img.getAttribute('src') || await img.getAttribute('data-src') || await img.getAttribute('data-lazy');
          if (src && !src.includes('placeholder') && !src.includes('loading') && !src.includes('default')) {
            const fullImageUrl = src.startsWith('http') ? src : 
                               src.startsWith('//') ? `https:${src}` : 
                               `${this.config.baseUrl}${src}`;
            if (!images.includes(fullImageUrl)) {
              images.push(fullImageUrl);
            }
          }
        } catch (error) {
          console.error('Error extracting image:', error);
        }
      }
      
      // Extract additional details
      const propertyType = await this.extractText('.property-type, .listing-type, .loai-hinh, .type');
      const legalStatus = await this.extractText('.legal-status, .phap-ly, .legal, .giay-to');
      const direction = await this.extractText('.direction, .huong, .orientation, .huong-nha');
      const bedrooms = await this.extractText('.bedrooms, .phong-ngu, .bedroom, .so-phong-ngu');
      const bathrooms = await this.extractText('.bathrooms, .phong-tam, .bathroom, .so-phong-tam');
      const floors = await this.extractText('.floors, .tang, .floor, .so-tang');
      
      // Get current URL
      const currentUrl = await this.hero.url;
      
      // Parse extracted data
      const price = DataProcessor.parsePrice(priceText);
      const area = DataProcessor.parseArea(areaText);
      const addressInfo = DataProcessor.parseAddress(address);
      const features = DataProcessor.extractFeatures(description);
      const phoneNumbers = DataProcessor.extractPhoneNumbers(`${contactPhone} ${description}`);
      
      const property: ScrapedProperty = {
        title: DataProcessor.cleanText(title),
        description: DataProcessor.cleanText(description),
        price: {
          amount: price.amount,
          currency: 'VND',
          unit: priceText.toLowerCase().includes('m2') || priceText.toLowerCase().includes('m²') ? 'per_m2' : 'total',
          negotiable: priceText.toLowerCase().includes('thỏa thuận') || priceText.toLowerCase().includes('thoả thuận') || priceText.toLowerCase().includes('tl')
        },
        address: {
          full: DataProcessor.cleanText(address),
          street: addressInfo.street,
          ward: addressInfo.ward,
          district: addressInfo.district,
          city: addressInfo.city,
          coordinates: null // Will be geocoded later if needed
        },
        area: {
          total: area,
          usable: null,
          unit: 'm2'
        },
        propertyType: DataProcessor.cleanText(propertyType) || 'Khác',
        legalStatus: DataProcessor.cleanText(legalStatus) || 'Không rõ',
        direction: DataProcessor.cleanText(direction),
        features: {
          bedrooms: parseInt(DataProcessor.cleanText(bedrooms)) || null,
          bathrooms: parseInt(DataProcessor.cleanText(bathrooms)) || null,
          floors: parseInt(DataProcessor.cleanText(floors)) || null,
          parking: features.parking,
          balcony: features.balcony,
          garden: features.garden,
          elevator: features.elevator,
          security: features.security,
          furnished: features.furnished
        },
        images: images.slice(0, 10), // Limit to 10 images
        contact: {
          name: DataProcessor.cleanText(contactName),
          phone: phoneNumbers[0] || DataProcessor.cleanText(contactPhone),
          email: null
        },
        url: currentUrl,
        source: 'nha.com.vn',
        scrapedAt: new Date(),
        hash: DataProcessor.generatePropertyHash({
          title: DataProcessor.cleanText(title),
          address: DataProcessor.cleanText(address),
          price: price.amount
        })
      };
      
      console.log(`Scraped property: ${property.title}`);
      return property;
      
    } catch (error) {
      console.error('Error scraping current page property:', error);
      return null;
    }
  }

  /**
   * Start scraping Nha.com.vn
   */
  async startScraping(maxProperties: number = 50): Promise<void> {
    const startUrls = [
      'https://nha.com.vn/ban-nha-rieng',
      'https://nha.com.vn/ban-can-ho',
      'https://nha.com.vn/ban-dat',
      'https://nha.com.vn/cho-thue-can-ho',
      'https://nha.com.vn/cho-thue-nha-rieng'
    ];
    
    console.log('Starting Nha.com.vn scraping...');
    
    for (const startUrl of startUrls) {
      if (this.scrapedProperties.length >= maxProperties) {
        console.log(`Reached target of ${maxProperties} properties`);
        break;
      }
      
      console.log(`Scraping category: ${startUrl}`);
      
      try {
        const result = await this.scrape(startUrl, Math.ceil(maxProperties / startUrls.length));
        console.log(`Category result:`, result);
      } catch (error) {
        console.error(`Error scraping category ${startUrl}:`, error);
        this.errors.push(`Category error ${startUrl}: ${error}`);
      }
      
      // Delay between categories
      await DataProcessor.delay(3000, 5000);
    }
    
    console.log(`Nha.com.vn scraping completed. Total properties: ${this.scrapedProperties.length}`);
  }
}