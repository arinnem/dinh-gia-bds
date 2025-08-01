"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlonhadatScraper = void 0;
const baseScraper_1 = require("./baseScraper");
const dataProcessor_1 = require("../utils/dataProcessor");
const scrapers_1 = require("../config/scrapers");
class AlonhadatScraper extends baseScraper_1.BaseScraper {
    constructor() {
        super(scrapers_1.scraperConfigs.alonhadat);
    }
    /**
     * Extract pagination links from Alonhadat.com.vn
     */
    async extractPaginationLinks() {
        const urls = [];
        try {
            if (!this.hero)
                return urls;
            // Alonhadat pagination selectors
            const paginationSelector = '.pagination a, .paging a, .page-numbers a, .next, .page-link';
            const paginationElements = await this.extractElements(paginationSelector);
            for (const element of paginationElements) {
                try {
                    const href = await element.getAttribute('href');
                    if (href && (href.includes('/page-') || href.includes('?page=') || href.includes('/p'))) {
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
            // Construct pagination URLs manually for Alonhadat
            const currentUrl = await this.hero.url;
            const baseUrl = currentUrl.split('?')[0].replace(/\/page-\d+/, '');
            for (let page = 2; page <= (this.config.maxPages || 5); page++) {
                const pageUrl = `${baseUrl}/page-${page}`;
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
            // Common selectors for property links on Alonhadat
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
        return (url.includes('alonhadat.com.vn') &&
            (url.includes('/ban-') || url.includes('/cho-thue-')) &&
            !url.includes('/tim-kiem') &&
            !url.includes('/dang-tin') &&
            !url.includes('/page-') &&
            !url.includes('/search') &&
            url.includes('.html'));
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
            const title = await this.extractText('h1, .title, .ct_title, .detail-title, .property-title');
            if (!title) {
                console.log('No title found, skipping property');
                return null;
            }
            const priceText = await this.extractText('.price, .gia, .cost, .money, .ct_price');
            const areaText = await this.extractText('.area, .dien-tich, .size, .ct_dt, .acreage');
            const address = await this.extractText('.address, .dia-chi, .location, .ct_dt, .local');
            const description = await this.extractText('.description, .mo-ta, .content, .detail, .ct_detail');
            // Extract contact information
            const contactName = await this.extractText('.contact-name, .seller-name, .owner-name, .ct_contact .name, .lien-he');
            const contactPhone = await this.extractText('.contact-phone, .seller-phone, .owner-phone, .ct_contact .phone, .phone');
            // Extract images
            const images = [];
            const imageElements = await this.extractElements('.property-images img, .gallery img, .slider img, .photos img, .ct_image img, .detail-images img');
            for (const img of imageElements) {
                try {
                    const src = await img.getAttribute('src') || await img.getAttribute('data-src') || await img.getAttribute('data-original');
                    if (src && !src.includes('placeholder') && !src.includes('loading') && !src.includes('default') && !src.includes('no-image')) {
                        const fullImageUrl = src.startsWith('http') ? src :
                            src.startsWith('//') ? `https:${src}` :
                                `${this.config.baseUrl}${src}`;
                        if (!images.includes(fullImageUrl)) {
                            images.push(fullImageUrl);
                        }
                    }
                }
                catch (error) {
                    console.error('Error extracting image:', error);
                }
            }
            // Extract additional details from table or list format
            const propertyType = await this.extractText('.property-type, .loai-hinh, .type, .ct_type') ||
                await this.extractTableValue('Loại hình') ||
                await this.extractTableValue('Loại BDS');
            const legalStatus = await this.extractText('.legal-status, .phap-ly, .legal, .giay-to') ||
                await this.extractTableValue('Pháp lý') ||
                await this.extractTableValue('Giấy tờ');
            const direction = await this.extractText('.direction, .huong, .orientation') ||
                await this.extractTableValue('Hướng') ||
                await this.extractTableValue('Hướng nhà');
            const bedrooms = await this.extractText('.bedrooms, .phong-ngu, .bedroom') ||
                await this.extractTableValue('Phòng ngủ') ||
                await this.extractTableValue('Số phòng ngủ');
            const bathrooms = await this.extractText('.bathrooms, .phong-tam, .bathroom') ||
                await this.extractTableValue('Phòng tắm') ||
                await this.extractTableValue('Số toilet');
            const floors = await this.extractText('.floors, .tang, .floor') ||
                await this.extractTableValue('Số tầng') ||
                await this.extractTableValue('Tầng');
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
                    unit: priceText.toLowerCase().includes('m2') || priceText.toLowerCase().includes('m²') ? 'per_m2' : 'total',
                    negotiable: priceText.toLowerCase().includes('thỏa thuận') || priceText.toLowerCase().includes('thoả thuận') || priceText.toLowerCase().includes('tl')
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
                source: 'alonhadat.com.vn',
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
     * Extract value from table format (common in Alonhadat)
     */
    async extractTableValue(label) {
        try {
            if (!this.hero)
                return '';
            // Try different table selectors
            const tableSelectors = [
                `td:contains("${label}") + td`,
                `th:contains("${label}") + td`,
                `.table td:contains("${label}") + td`,
                `.info-table td:contains("${label}") + td`,
                `.detail-table td:contains("${label}") + td`
            ];
            for (const selector of tableSelectors) {
                const value = await this.extractText(selector);
                if (value) {
                    return value;
                }
            }
            // Try list format
            const listSelectors = [
                `li:contains("${label}")`
            ];
            for (const selector of listSelectors) {
                const text = await this.extractText(selector);
                if (text && text.includes(':')) {
                    const parts = text.split(':');
                    if (parts.length > 1) {
                        return parts[1].trim();
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error extracting table value for ${label}:`, error);
        }
        return '';
    }
    /**
     * Start scraping Alonhadat.com.vn
     */
    async startScraping(maxProperties = 50) {
        const startUrls = [
            'https://alonhadat.com.vn/nha-dat/can-ban',
            'https://alonhadat.com.vn/nha-dat/can-thue',
            'https://alonhadat.com.vn/nha-dat/can-ban/nha-rieng',
            'https://alonhadat.com.vn/nha-dat/can-ban/can-ho-chung-cu',
            'https://alonhadat.com.vn/nha-dat/can-ban/dat'
        ];
        console.log('Starting Alonhadat.com.vn scraping...');
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
        console.log(`Alonhadat scraping completed. Total properties: ${this.scrapedProperties.length}`);
    }
}
exports.AlonhadatScraper = AlonhadatScraper;
//# sourceMappingURL=alonhadatScraper.js.map