import { BatDongSanScraper } from './batdongsanScraper';
import { NhaScraper } from './nhaScraper';
import { AlonhadatScraper } from './alonhadatScraper';
import { ScraperResult, ScrapingSession } from '../types';
import { DatabaseConnection } from '../config/database';
import { globalConfig } from '../config/scrapers';
import { DataProcessor } from '../utils/dataProcessor';

export class ScraperOrchestrator {
  private scrapers: Map<string, any> = new Map();
  private dbConnection: DatabaseConnection;
  private session: ScrapingSession;

  constructor() {
    this.dbConnection = DatabaseConnection.getInstance();
    this.session = {
      id: this.generateSessionId(),
      startTime: new Date(),
      endTime: undefined,
      totalProperties: 0,
      totalPropertiesScraped: 0,
      successfulProperties: 0,
      failedProperties: 0,
      totalErrors: 0,
      sources: [],
      scraperResults: [],
      status: 'running'
    };

    // Initialize scrapers
    this.scrapers.set('batdongsan', new BatDongSanScraper());
    this.scrapers.set('nha', new NhaScraper());
    this.scrapers.set('alonhadat', new AlonhadatScraper());
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `scraping_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Test database connection
   */
  async testDatabaseConnection(): Promise<boolean> {
    try {
      const isConnected = await this.dbConnection.testConnection();
      if (isConnected) {
        console.log('✅ Database connection successful');
        return true;
      } else {
        console.error('❌ Database connection failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Database connection error:', error);
      return false;
    }
  }

  /**
   * Run all scrapers sequentially
   */
  async runAllScrapers(propertiesPerSite: number = 50): Promise<ScrapingSession> {
    console.log(`🚀 Starting scraping session: ${this.session.id}`);
    console.log(`📊 Target: ${propertiesPerSite} properties per site`);
    console.log(`🌐 Sites: ${Array.from(this.scrapers.keys()).join(', ')}`);

    // Test database connection first
    const dbConnected = await this.testDatabaseConnection();
    if (!dbConnected) {
      this.session.status = 'failed';
      this.session.endTime = new Date();
      throw new Error('Database connection failed. Cannot proceed with scraping.');
    }

    try {
      // Run scrapers sequentially to avoid overwhelming the sites
      for (const [name, scraper] of this.scrapers) {
        console.log(`\n🔄 Starting ${name} scraper...`);
        
        try {
          const startTime = Date.now();
          await scraper.startScraping(propertiesPerSite);
          const duration = Date.now() - startTime;
          
          const result: ScraperResult = {
            success: scraper.getScrapedProperties().length > 0,
            propertiesScraped: scraper.getScrapedProperties().length,
            errors: scraper.getErrors(),
            duration,
            source: name
          };
          
          this.session.scraperResults.push(result);
          this.session.totalPropertiesScraped += result.propertiesScraped;
          this.session.totalErrors += result.errors.length;
          
          console.log(`✅ ${name} completed:`);
          console.log(`   📦 Properties: ${result.propertiesScraped}`);
          console.log(`   ⚠️  Errors: ${result.errors.length}`);
          console.log(`   ⏱️  Duration: ${Math.round(duration / 1000)}s`);
          
          if (result.errors.length > 0) {
            console.log(`   🔍 First few errors:`);
            result.errors.slice(0, 3).forEach(error => {
              console.log(`      - ${error}`);
            });
          }
          
        } catch (error) {
          console.error(`❌ ${name} scraper failed:`, error);
          
          const result: ScraperResult = {
            success: false,
            propertiesScraped: 0,
            errors: [String(error)],
            duration: 0,
            source: name
          };
          
          this.session.scraperResults.push(result);
          this.session.totalErrors += 1;
        }
        
        // Delay between scrapers to be respectful
        if (this.scrapers.size > 1) {
          console.log(`⏳ Waiting ${globalConfig.retryDelay / 1000}s before next scraper...`);
          await DataProcessor.delay(globalConfig.retryDelay, globalConfig.retryDelay + 2000);
        }
      }
      
      this.session.status = 'completed';
      
    } catch (error) {
      console.error('❌ Scraping session failed:', error);
      this.session.status = 'failed';
      throw error;
    } finally {
      this.session.endTime = new Date();
      await this.logSessionSummary();
    }

    return this.session;
  }

  /**
   * Run specific scraper
   */
  async runScraper(scraperName: string, maxProperties: number = 50): Promise<ScraperResult> {
    const scraper = this.scrapers.get(scraperName);
    if (!scraper) {
      throw new Error(`Scraper '${scraperName}' not found. Available: ${Array.from(this.scrapers.keys()).join(', ')}`);
    }

    console.log(`🔄 Running ${scraperName} scraper...`);
    
    try {
      const startTime = Date.now();
      await scraper.startScraping(maxProperties);
      const duration = Date.now() - startTime;
      
      const result: ScraperResult = {
        success: scraper.getScrapedProperties().length > 0,
        propertiesScraped: scraper.getScrapedProperties().length,
        errors: scraper.getErrors(),
        duration,
        source: scraperName
      };
      
      console.log(`✅ ${scraperName} completed:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ ${scraperName} failed:`, error);
      
      const result: ScraperResult = {
        success: false,
        propertiesScraped: 0,
        errors: [String(error)],
        duration: 0,
        source: scraperName
      };
      
      return result;
    }
  }

  /**
   * Get available scrapers
   */
  getAvailableScrapers(): string[] {
    return Array.from(this.scrapers.keys());
  }

  /**
   * Get current session info
   */
  getCurrentSession(): ScrapingSession {
    return this.session;
  }

  /**
   * Log session summary
   */
  private async logSessionSummary(): Promise<void> {
    const duration = this.session.endTime 
      ? this.session.endTime.getTime() - this.session.startTime.getTime()
      : Date.now() - this.session.startTime.getTime();
    
    console.log('\n📊 SCRAPING SESSION SUMMARY');
    console.log('=' .repeat(50));
    console.log(`🆔 Session ID: ${this.session.id}`);
    console.log(`📅 Started: ${this.session.startTime.toLocaleString()}`);
    console.log(`📅 Ended: ${this.session.endTime?.toLocaleString() || 'Still running'}`);
    console.log(`⏱️  Total Duration: ${Math.round(duration / 1000)}s`);
    console.log(`📦 Total Properties: ${this.session.totalPropertiesScraped}`);
    console.log(`⚠️  Total Errors: ${this.session.totalErrors}`);
    console.log(`✅ Status: ${this.session.status}`);
    
    console.log('\n📈 SCRAPER BREAKDOWN:');
    this.session.scraperResults.forEach(result => {
      console.log(`  ${result.source}:`);
      console.log(`    📦 Properties: ${result.propertiesScraped}`);
      console.log(`    ⚠️  Errors: ${result.errors.length}`);
      console.log(`    ⏱️  Duration: ${Math.round(result.duration / 1000)}s`);
      console.log(`    ✅ Success: ${result.success ? 'Yes' : 'No'}`);
    });
    
    // Save session to database if possible
    try {
      await this.saveSessionToDatabase();
      console.log('\n💾 Session saved to database');
    } catch (error) {
      console.error('\n❌ Failed to save session to database:', error);
    }
    
    console.log('=' .repeat(50));
  }

  /**
   * Save session to database
   */
  private async saveSessionToDatabase(): Promise<void> {
    try {
      const query = `
        INSERT INTO scraping_sessions (
          session_id, start_time, end_time, total_properties, total_errors, 
          status, scraper_results, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (session_id) DO UPDATE SET
          end_time = EXCLUDED.end_time,
          total_properties = EXCLUDED.total_properties,
          total_errors = EXCLUDED.total_errors,
          status = EXCLUDED.status,
          scraper_results = EXCLUDED.scraper_results,
          updated_at = NOW()
      `;
      
      await this.dbConnection.query(query, [
        this.session.id,
        this.session.startTime,
        this.session.endTime,
        this.session.totalPropertiesScraped,
        this.session.totalErrors,
        this.session.status,
        JSON.stringify(this.session.scraperResults)
      ]);
      
    } catch (error) {
      // If table doesn't exist, create it
      if (error instanceof Error && error.message.includes('relation "scraping_sessions" does not exist')) {
        await this.createSessionTable();
        // Retry saving
        await this.saveSessionToDatabase();
      } else {
        throw error;
      }
    }
  }

  /**
   * Create scraping sessions table
   */
  private async createSessionTable(): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS scraping_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        total_properties INTEGER DEFAULT 0,
        total_errors INTEGER DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        scraper_results JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_scraping_sessions_session_id ON scraping_sessions(session_id);
      CREATE INDEX IF NOT EXISTS idx_scraping_sessions_start_time ON scraping_sessions(start_time);
      CREATE INDEX IF NOT EXISTS idx_scraping_sessions_status ON scraping_sessions(status);
    `;
    
    await this.dbConnection.query(createTableQuery);
    console.log('📊 Created scraping_sessions table');
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.dbConnection.close();
      console.log('🧹 Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}

// Export individual scrapers for direct use
export { BatDongSanScraper, NhaScraper, AlonhadatScraper };