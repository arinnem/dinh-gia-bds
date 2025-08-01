"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatDongSanScraper = void 0;
const baseScraper_1 = require("./baseScraper");
const dataProcessor_1 = require("../utils/dataProcessor");
const scrapers_1 = require("../config/scrapers");
class BatDongSanScraper extends baseScraper_1.BaseScraper {
    constructor() {
        super(scrapers_1.scraperConfigs.batdongsan);
    }
    /**
     * Extract pagination links from BatDongSan.com.vn
     */
    async extractPaginationLinks() {
        const urls = [];
        try {
            if (!this.hero)
                return urls;
            // BatDongSan pagination selector
            const paginationSelector = '.pagination a, .paging a, .page-numbers a';
            const paginationElements = await this.extractElements(paginationSelector);
            for (const element of paginationElements) {
                try {
                    const href = await element.getAttribute('href');
                    if (href && href.includes('/page/') || href.includes('?page=')) {
                        const fullUrl = href.startsWith('http') ? href : `${this.config.baseUrl}${href}`;
                        if (!urls.includes(fullUrl)) {
                            urls.push(fullUrl);
                        }
                    }
                }
                catch (error) {
                    console.error('Error extracting pagination link:', error);
                }
            }
            // Also try to construct pagination URLs manually
            const currentUrl = await this.hero.url;
            const baseUrl = currentUrl.split('?')[0];
            for (let page = 2; page <= (this.config.maxPages || 5); page++) {
                const pageUrl = `${baseUrl}?page=${page}`;
                if (!urls.includes(pageUrl)) {
                    urls.push(pageUrl);
                }
            }
        }
        catch (error) {
            console.error('Error extracting pagination links:', error);
        }
        return urls.slice(0, this.config.maxPages || 5);
    }
    /**
     * Extract property URLs from current page
     */
    async extractPropertyUrls() {
        const urls = [];
        try {
            if (!this.hero)
                return urls;
            // Common selectors for property links on BatDongSan
            const linkSelectors = [
                '.product-item a[href*="/ban/"]',
                '.product-item a[href*="/cho-thue/"]',
                '.re__card-title a',
                '.product-title a',
                '.listing-item a',
                'a[href*="batdongsan.com.vn"][href*="/ban/"]',
                'a[href*="batdongsan.com.vn"][href*="/cho-thue/"]'
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
                    }
                    catch (error) {
                        console.error('Error extracting property URL:', error);
                    }
                }
            }
        }
        catch (error) {
            console.error('Error extracting property URLs:', error);
        }
        return urls;
    }
    /**
     * Validate if URL is a valid property listing
     */
    isValidPropertyUrl(url) {
        return (url.includes('batdongsan.com.vn') &&
            (url.includes('/ban/') || url.includes('/cho-thue/')) &&
            !url.includes('/tim-kiem') &&
            !url.includes('/dang-tin') &&
            !url.includes('/page/'));
    }
    /**
     * Extract property data from current page
     */
    async extractPropertyData() {
        const properties = [];
        try {
            if (!this.hero)
                return properties;
            // First try to get property URLs from listing page
            const propertyUrls = await this.extractPropertyUrls();
            if (propertyUrls.length > 0) {
                // This is a listing page, scrape individual properties
                console.log(`Found ${propertyUrls.length} property URLs on listing page`);
                for (const url of propertyUrls) {
                    if (properties.length >= (this.config.maxProperties || 50))
                        break;
                    const property = await this.scrapeIndividualProperty(url);
                    if (property) {
                        properties.push(property);
                    }
                    // Delay between individual property scrapes
                    await dataProcessor_1.DataProcessor.delay(1000, 2000);
                }
            }
            else {
                // This might be an individual property page
                const property = await this.scrapeCurrentPageProperty();
                if (property) {
                    properties.push(property);
                }
            }
        }
        catch (error) {
            console.error('Error extracting property data:', error);
        }
        return properties;
    }
    /**
     * Scrape individual property from its detail page
     */
    async scrapeIndividualProperty(url) {
        try {
            const navigated = await this.navigateWithRetry(url);
            if (!navigated) {
                console.error(`Failed to navigate to property: ${url}`);
                return null;
            }
            return await this.scrapeCurrentPageProperty();
        }
        catch (error) {
            console.error(`Error scraping individual property ${url}:`, error);
            return null;
        }
    }
    /**
     * Scrape property data from current page
     */
    async scrapeCurrentPageProperty() {
        try {
            if (!this.hero)
                return null;
            // Extract basic property information
            const title = await this.extractText('h1, .product-title, .re__pr-title, .detail-title');
            if (!title) {
                console.log('No title found, skipping property');
                return null;
            }
            const priceText = await this.extractText('.product-price, .re__pr-price, .price, .gia-ban, .re__pr-short-info-item:contains("Giá")');
            const areaText = await this.extractText('.product-area, .re__pr-short-info-item:contains("Diện tích"), .dien-tich, .area');
            const address = await this.extractText('.product-address, .re__pr-short-info-item:contains("Địa chỉ"), .dia-chi, .address, .location');
            const description = await this.extractText('.product-description, .re__section-body, .mo-ta, .description, .detail-content');
            // Extract contact information
            const contactName = await this.extractText('.contact-name, .re__contact-name, .lien-he .name, .seller-name');
            const contactPhone = await this.extractText('.contact-phone, .re__contact-phone, .lien-he .phone, .seller-phone');
            // Extract images
            const images = [];
            const imageElements = await this.extractElements('.product-images img, .re__media img, .hinh-anh img, .gallery img');
            for (const img of imageElements) {
                try {
                    const src = await img.getAttribute('src') || await img.getAttribute('data-src');
                    if (src && !src.includes('placeholder') && !src.includes('loading')) {
                        const fullImageUrl = src.startsWith('http') ? src : `https:${src}`;
                        if (!images.includes(fullImageUrl)) {
                            images.push(fullImageUrl);
                        }
                    }
                }
                catch (error) {
                    console.error('Error extracting image:', error);
                }
            }
            // Extract additional details
            const propertyType = await this.extractText('.product-type, .re__pr-short-info-item:contains("Loại hình"), .loai-hinh, .property-type');
            const legalStatus = await this.extractText('.legal-status, .re__pr-short-info-item:contains("Pháp lý"), .phap-ly, .legal');
            const direction = await this.extractText('.direction, .re__pr-short-info-item:contains("Hướng"), .huong, .orientation');
            const bedrooms = await this.extractText('.bedrooms, .re__pr-short-info-item:contains("Phòng ngủ"), .phong-ngu, .bedroom');
            const bathrooms = await this.extractText('.bathrooms, .re__pr-short-info-item:contains("Phòng tắm"), .phong-tam, .bathroom');
            const floors = await this.extractText('.floors, .re__pr-short-info-item:contains("Tầng"), .tang, .floor');
            // Get current URL
            const currentUrl = await this.hero.url;
            // Parse extracted data
            const price = dataProcessor_1.DataProcessor.parsePrice(priceText);
            const area = dataProcessor_1.DataProcessor.parseArea(areaText);
            const addressInfo = dataProcessor_1.DataProcessor.parseAddress(address);
            const features = dataProcessor_1.DataProcessor.extractFeatures(description);
            const phoneNumbers = dataProcessor_1.DataProcessor.extractPhoneNumbers(`${contactPhone} ${description}`);
            const property = {
                title: dataProcessor_1.DataProcessor.cleanText(title),
                description: dataProcessor_1.DataProcessor.cleanText(description),
                price: {
                    amount: price.amount,
                    currency: 'VND',
                    unit: priceText.toLowerCase().includes('m2') ? 'per_m2' : 'total',
                    negotiable: priceText.toLowerCase().includes('thỏa thuận') || priceText.toLowerCase().includes('thoả thuận')
                },
                address: {
                    full: dataProcessor_1.DataProcessor.cleanText(address),
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
                propertyType: dataProcessor_1.DataProcessor.cleanText(propertyType) || 'Khác',
                legalStatus: dataProcessor_1.DataProcessor.cleanText(legalStatus) || 'Không rõ',
                direction: dataProcessor_1.DataProcessor.cleanText(direction),
                features: {
                    bedrooms: parseInt(dataProcessor_1.DataProcessor.cleanText(bedrooms)) || null,
                    bathrooms: parseInt(dataProcessor_1.DataProcessor.cleanText(bathrooms)) || null,
                    floors: parseInt(dataProcessor_1.DataProcessor.cleanText(floors)) || null,
                    parking: features.parking,
                    balcony: features.balcony,
                    garden: features.garden,
                    elevator: features.elevator,
                    security: features.security,
                    furnished: features.furnished
                },
                images: images.slice(0, 10), // Limit to 10 images
                contact: {
                    name: dataProcessor_1.DataProcessor.cleanText(contactName),
                    phone: phoneNumbers[0] || dataProcessor_1.DataProcessor.cleanText(contactPhone),
                    email: null
                },
                url: currentUrl,
                source: 'batdongsan.com.vn',
                scrapedAt: new Date(),
                hash: dataProcessor_1.DataProcessor.generatePropertyHash({
                    title: dataProcessor_1.DataProcessor.cleanText(title),
                    address: dataProcessor_1.DataProcessor.cleanText(address),
                    price: price.amount
                })
            };
            console.log(`Scraped property: ${property.title}`);
            return property;
        }
        catch (error) {
            console.error('Error scraping current page property:', error);
            return null;
        }
    }
    /**
     * Start scraping BatDongSan.com.vn
     */
    async startScraping(maxProperties = 50) {
        const startUrls = [
            'https://batdongsan.com.vn/ban-nha-rieng',
            'https://batdongsan.com.vn/ban-can-ho-chung-cu',
            'https://batdongsan.com.vn/ban-dat',
            'https://batdongsan.com.vn/cho-thue-can-ho-chung-cu',
            'https://batdongsan.com.vn/cho-thue-nha-rieng'
        ];
        console.log('Starting BatDongSan.com.vn scraping...');
        for (const startUrl of startUrls) {
            if (this.scrapedProperties.length >= maxProperties) {
                console.log(`Reached target of ${maxProperties} properties`);
                break;
            }
            console.log(`Scraping category: ${startUrl}`);
            try {
                const result = await this.scrape(startUrl, Math.ceil(maxProperties / startUrls.length));
                console.log(`Category result:`, result);
            }
            catch (error) {
                console.error(`Error scraping category ${startUrl}:`, error);
                this.errors.push(`Category error ${startUrl}: ${error}`);
            }
            // Delay between categories
            await dataProcessor_1.DataProcessor.delay(3000, 5000);
        }
        console.log(`BatDongSan scraping completed. Total properties: ${this.scrapedProperties.length}`);
    }
}
exports.BatDongSanScraper = BatDongSanScraper;
//# sourceMappingURL=batdongsanScraper.js.map