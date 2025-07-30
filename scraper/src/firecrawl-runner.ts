import 'dotenv/config';
import { FirecrawlBatdongsanScraper } from './firecrawlBatdongsanScraper';

console.log('[Runner] firecrawl-runner.ts starting...');

const debug = process.argv.includes('--debug');
const startUrls = (process.env.FIRECRAWL_START_URLS || '').split(',').map(u => u.trim()).filter(Boolean);

console.log('[Runner] FIRECRAWL_START_URLS:', startUrls);

async function main() {
  if (!process.env.FIRECRAWL_API_KEY) throw new Error('FIRECRAWL_API_KEY not set in .env');
  if (!startUrls.length) throw new Error('FIRECRAWL_START_URLS not set in .env');

  // Only run Batdongsan scraper on the first batdongsan.com.vn URL
  const batdongsanUrl = startUrls.find(url => url.includes('batdongsan.com.vn'));
  console.log('[Runner] batdongsanUrl:', batdongsanUrl);

  if (!batdongsanUrl) {
    throw new Error('No batdongsan.com.vn URL found in FIRECRAWL_START_URLS');
  }
  const scraper = new FirecrawlBatdongsanScraper({ name: 'batdongsan', baseUrl: batdongsanUrl, debug });
  console.log(`[Firecrawl] Scraping: ${batdongsanUrl}`);
  const properties = await scraper.scrape(batdongsanUrl);
  console.log(`[Firecrawl] Scraped ${properties.length} properties from ${batdongsanUrl}`);
  for (const property of properties) {
    console.log(property);
  }
}

main().catch(err => {
  console.error('Runner error:', err);
}); 