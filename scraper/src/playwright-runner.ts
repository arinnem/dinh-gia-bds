import { BatdongsanScraper } from './scrapers/batdongsanScraper.playwright';
import { PropertyService } from './database/propertyService';
import crypto from 'crypto';
import { toCanonicalScrapedProperty } from './utils/typeConverters';

const debug = process.argv.includes('--debug');

const config = {
  name: 'batdongsan',
  baseUrl: 'https://batdongsan.com.vn/ban-nha-rieng',
  maxProperties: 5,
  delayMin: 1000,
  delayMax: 2000,
  debug,
};

async function main() {
  const scraper = new BatdongsanScraper(config);
  const propertyService = new PropertyService();

  console.log('Starting Playwright scraper...');
  const properties = await scraper.scrape(config.baseUrl, config.maxProperties);
  console.log(`Scraped ${properties.length} properties.`);

  for (const property of properties) {
    try {
      property.hash = crypto.createHash('sha256').update(property.url).digest('hex');
      const canonicalProperty = toCanonicalScrapedProperty(property);
      await propertyService.insertProperty(canonicalProperty);
      console.log(`Inserted property: ${property.title}`);
    } catch (err) {
      console.error('Failed to insert property:', property.url, err);
    }
  }

  console.log('Done.');
}

main().catch(err => {
  console.error('Runner error:', err);
}); 