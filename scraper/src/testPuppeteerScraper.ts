import { PuppeteerScraper } from './scrapers/puppeteerScraper';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPuppeteerScraper() {
  const scraper = new PuppeteerScraper();
  
  try {
    console.log('🚀 Starting Puppeteer scraper test...');
    
    const result = await scraper.scrapeBatDongSan(10); // Test with 10 properties
    
    console.log('\n📊 Scraping Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`🏠 Properties scraped: ${result.propertiesScraped}`);
    console.log(`⏱️ Duration: ${result.duration}ms`);
    console.log(`🌐 Source: ${result.source}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await scraper.close();
    console.log('\n🔚 Test completed');
    process.exit(0);
  }
}

testPuppeteerScraper();