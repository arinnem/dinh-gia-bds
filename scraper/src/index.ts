#!/usr/bin/env node

import dotenv from 'dotenv';
import { ScraperOrchestrator } from './scrapers';
import { DatabaseConnection } from './config/database';

// Load environment variables
dotenv.config();

/**
 * Main scraping application
 */
class ScrapingApp {
  private orchestrator: ScraperOrchestrator;

  constructor() {
    this.orchestrator = new ScraperOrchestrator();
  }

  /**
   * Display help information
   */
  private displayHelp(): void {
    console.log(`
🏠 Vietnamese Real Estate Scraper
`);
    console.log('Usage: npm run scrape [options]\n');
    console.log('Options:');
    console.log('  --help, -h              Show this help message');
    console.log('  --all                   Run all scrapers (default)');
    console.log('  --scraper <name>        Run specific scraper (batdongsan, nha, alonhadat)');
    console.log('  --properties <number>   Number of properties per site (default: 50)');
    console.log('  --test-db               Test database connection only');
    console.log('  --list-scrapers         List available scrapers');
    console.log('');
    console.log('Examples:');
    console.log('  npm run scrape                           # Run all scrapers, 50 properties each');
    console.log('  npm run scrape -- --properties 100      # Run all scrapers, 100 properties each');
    console.log('  npm run scrape -- --scraper batdongsan   # Run only BatDongSan scraper');
    console.log('  npm run scrape -- --test-db              # Test database connection');
    console.log('');
    console.log('Environment Variables:');
    console.log('  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
    console.log('  SCRAPER_DELAY_MIN, SCRAPER_DELAY_MAX');
    console.log('  LOG_LEVEL, LOG_FILE');
    console.log('');
  }

  /**
   * Parse command line arguments
   */
  private parseArgs(): {
    action: 'help' | 'all' | 'single' | 'test-db' | 'list-scrapers';
    scraper?: string;
    properties: number;
  } {
    const args = process.argv.slice(2);
    let action: 'help' | 'all' | 'single' | 'test-db' | 'list-scrapers' = 'all';
    let scraper: string | undefined;
    let properties = 50;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      switch (arg) {
        case '--help':
        case '-h':
          action = 'help';
          break;
          
        case '--all':
          action = 'all';
          break;
          
        case '--scraper':
          action = 'single';
          scraper = args[i + 1];
          i++; // Skip next argument
          break;
          
        case '--properties':
          properties = parseInt(args[i + 1]) || 50;
          i++; // Skip next argument
          break;
          
        case '--test-db':
          action = 'test-db';
          break;
          
        case '--list-scrapers':
          action = 'list-scrapers';
          break;
      }
    }

    return { action, scraper, properties };
  }

  /**
   * Test database connection
   */
  private async testDatabase(): Promise<void> {
    console.log('🔍 Testing database connection...');
    
    try {
      const dbConnection = DatabaseConnection.getInstance();
      const isConnected = await dbConnection.testConnection();
      
      if (isConnected) {
        console.log('✅ Database connection successful!');
        
        // Test basic queries
        console.log('🔍 Testing basic queries...');
        
        const tablesResult = await dbConnection.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        
        console.log(`📊 Found ${tablesResult.rows.length} tables:`);
        tablesResult.rows.forEach((row: any) => {
          console.log(`   - ${row.table_name}`);
        });
        
        // Check if properties table exists and has data
        try {
          const propertiesCount = await dbConnection.query('SELECT COUNT(*) FROM properties');
          console.log(`🏠 Properties in database: ${propertiesCount.rows[0].count}`);
        } catch (error) {
          console.log('⚠️  Properties table not found or empty');
        }
        
      } else {
        console.log('❌ Database connection failed!');
        process.exit(1);
      }
      
      await dbConnection.close();
      
    } catch (error) {
      console.error('❌ Database test failed:', error);
      process.exit(1);
    }
  }

  /**
   * List available scrapers
   */
  private listScrapers(): void {
    console.log('🌐 Available scrapers:');
    const scrapers = this.orchestrator.getAvailableScrapers();
    scrapers.forEach(scraper => {
      console.log(`   - ${scraper}`);
    });
    console.log('');
  }

  /**
   * Validate environment variables
   */
  private validateEnvironment(): boolean {
    const required = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
    const missing = required.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:');
      missing.forEach(env => {
        console.error(`   - ${env}`);
      });
      console.error('\nPlease check your .env file or environment configuration.');
      return false;
    }
    
    return true;
  }

  /**
   * Run the application
   */
  async run(): Promise<void> {
    const { action, scraper, properties } = this.parseArgs();

    // Handle help
    if (action === 'help') {
      this.displayHelp();
      return;
    }

    // Handle list scrapers (no database validation needed)
    if (action === 'list-scrapers') {
      this.listScrapers();
      return;
    }

    // Validate environment for database operations
    if (!this.validateEnvironment()) {
      process.exit(1);
    }

    // Handle database test
    if (action === 'test-db') {
      await this.testDatabase();
      return;
    }

    console.log('🚀 Starting Vietnamese Real Estate Scraper');
    console.log(`📊 Target: ${properties} properties per site`);
    
    try {
      let result;
      
      if (action === 'single' && scraper) {
        console.log(`🎯 Running single scraper: ${scraper}`);
        result = await this.orchestrator.runScraper(scraper, properties);
        console.log('\n📊 Single Scraper Result:', result);
        
      } else {
        console.log('🌐 Running all scrapers');
        const session = await this.orchestrator.runAllScrapers(properties);
        console.log('\n📊 Final Session Result:');
        console.log(`   📦 Total Properties: ${session.totalPropertiesScraped}`);
        console.log(`   ⚠️  Total Errors: ${session.totalErrors}`);
        console.log(`   ✅ Status: ${session.status}`);
      }
      
      console.log('\n🎉 Scraping completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Scraping failed:', error);
      process.exit(1);
      
    } finally {
      await this.orchestrator.cleanup();
    }
  }
}

/**
 * Handle uncaught errors
 */
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Handle graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
  process.exit(0);
});

// Run the application
if (require.main === module) {
  const app = new ScrapingApp();
  app.run().catch(error => {
    console.error('❌ Application failed:', error);
    process.exit(1);
  });
}

export { ScrapingApp };