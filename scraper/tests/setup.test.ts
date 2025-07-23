import { DatabaseConnection } from '../src/config/database';
import { ScraperOrchestrator } from '../src/scrapers';
import { DataProcessor } from '../src/utils/dataProcessor';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Test suite for scraper setup and basic functionality
 */
class ScraperTests {
  private dbConnection: DatabaseConnection;
  private orchestrator: ScraperOrchestrator;

  constructor() {
    this.dbConnection = DatabaseConnection.getInstance();
    this.orchestrator = new ScraperOrchestrator();
  }

  /**
   * Test database connection
   */
  async testDatabaseConnection(): Promise<boolean> {
    console.log('🔍 Testing database connection...');
    
    try {
      const isConnected = await this.dbConnection.testConnection();
      
      if (isConnected) {
        console.log('✅ Database connection successful');
        
        // Test basic query
        const result = await this.dbConnection.query('SELECT NOW() as current_time');
        console.log(`📅 Database time: ${result.rows[0].current_time}`);
        
        return true;
      } else {
        console.log('❌ Database connection failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Database connection error:', error);
      return false;
    }
  }

  /**
   * Test database schema
   */
  async testDatabaseSchema(): Promise<boolean> {
    console.log('🔍 Testing database schema...');
    
    try {
      // Check if required tables exist
      const requiredTables = [
        'properties', 'property_types', 'legal_statuses', 'directions',
        'districts', 'wards', 'users', 'projects'
      ];
      
      for (const table of requiredTables) {
        try {
          const result = await this.dbConnection.query(`SELECT COUNT(*) FROM ${table}`);
          console.log(`✅ Table '${table}': ${result.rows[0].count} records`);
        } catch (error) {
          console.error(`❌ Table '${table}' not found or inaccessible`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('❌ Database schema test failed:', error);
      return false;
    }
  }

  /**
   * Test data processing utilities
   */
  testDataProcessing(): boolean {
    console.log('🔍 Testing data processing utilities...');
    
    try {
      // Test price parsing
      const priceTests = [
        { input: '5.5 tỷ', expected: 5500000000 },
        { input: '850 triệu', expected: 850000000 },
        { input: '120 triệu', expected: 120000000 },
        { input: '2,5 tỷ', expected: 2500000000 }
      ];
      
      for (const test of priceTests) {
        const result = DataProcessor.parsePrice(test.input);
        if (result && Math.abs(result.amount - test.expected) > 1000) {
          console.error(`❌ Price parsing failed: '${test.input}' -> ${result.amount}, expected ${test.expected}`);
          return false;
        } else if (!result || result.amount === 0) {
          console.error(`❌ Price parsing failed: '${test.input}' -> ${result?.amount || 0}, expected ${test.expected}`);
          return false;
        }
      }
      console.log('✅ Price parsing tests passed');
      
      // Test area parsing
      const areaTests = [
        { input: '120m²', expected: 120 },
        { input: '85 m2', expected: 85 },
        { input: '200m²', expected: 200 }
      ];
      
      for (const test of areaTests) {
        const result = DataProcessor.parseArea(test.input);
        if (result !== test.expected) {
          console.error(`❌ Area parsing failed: '${test.input}' -> ${result}, expected ${test.expected}`);
          return false;
        }
      }
      console.log('✅ Area parsing tests passed');
      
      // Test address parsing
      const address = 'Số 123 Đường Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM';
      const addressInfo = DataProcessor.parseAddress(address);
      
      if (!addressInfo || !addressInfo.city || !addressInfo.district) {
        console.error('❌ Address parsing failed');
        return false;
      }
      console.log('✅ Address parsing tests passed');
      
      // Test phone number extraction
      const phoneText = 'Liên hệ: 0901234567 hoặc 028.1234.5678';
      const phones = DataProcessor.extractPhoneNumbers(phoneText);
      
      if (phones.length === 0) {
        console.error('❌ Phone number extraction failed');
        return false;
      }
      console.log('✅ Phone number extraction tests passed');
      
      return true;
    } catch (error) {
      console.error('❌ Data processing test failed:', error);
      return false;
    }
  }

  /**
   * Test scraper configuration
   */
  testScraperConfiguration(): boolean {
    console.log('🔍 Testing scraper configuration...');
    
    try {
      const scrapers = this.orchestrator.getAvailableScrapers();
      
      if (scrapers.length === 0) {
        console.error('❌ No scrapers available');
        return false;
      }
      
      console.log(`✅ Found ${scrapers.length} scrapers: ${scrapers.join(', ')}`);
      
      // Check required scrapers
      const requiredScrapers = ['batdongsan', 'nha', 'alonhadat'];
      for (const required of requiredScrapers) {
        if (!scrapers.includes(required)) {
          console.error(`❌ Required scraper '${required}' not found`);
          return false;
        }
      }
      
      console.log('✅ All required scrapers available');
      return true;
    } catch (error) {
      console.error('❌ Scraper configuration test failed:', error);
      return false;
    }
  }

  /**
   * Test environment variables
   */
  testEnvironmentVariables(): boolean {
    console.log('🔍 Testing environment variables...');
    
    const required = [
      'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'
    ];
    
    const missing = required.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      return false;
    }
    
    console.log('✅ All required environment variables present');
    
    // Check optional variables
    const optional = [
      'SCRAPER_DELAY_MIN', 'SCRAPER_DELAY_MAX', 'LOG_LEVEL'
    ];
    
    const presentOptional = optional.filter(env => process.env[env]);
    console.log(`📋 Optional variables present: ${presentOptional.join(', ')}`);
    
    return true;
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🧪 Running Scraper Setup Tests\n');
    console.log('=' .repeat(50));
    
    const tests = [
      { name: 'Environment Variables', test: () => this.testEnvironmentVariables() },
      { name: 'Database Connection', test: () => this.testDatabaseConnection() },
      { name: 'Database Schema', test: () => this.testDatabaseSchema() },
      { name: 'Data Processing', test: () => this.testDataProcessing() },
      { name: 'Scraper Configuration', test: () => this.testScraperConfiguration() }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const { name, test } of tests) {
      console.log(`\n🔬 ${name}`);
      console.log('-' .repeat(30));
      
      try {
        const result = await test();
        if (result) {
          console.log(`✅ ${name}: PASSED`);
          passed++;
        } else {
          console.log(`❌ ${name}: FAILED`);
          failed++;
        }
      } catch (error) {
        console.error(`❌ ${name}: ERROR -`, error);
        failed++;
      }
    }
    
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Scraper is ready to use.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the configuration.');
    }
    
    // Cleanup
    await this.dbConnection.close();
    await this.orchestrator.cleanup();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tests = new ScraperTests();
  tests.runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

export { ScraperTests };