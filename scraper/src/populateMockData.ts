import { MockDataGenerator } from './utils/mockDataGenerator';
import { PropertyService } from './database/propertyService';
import DatabaseConnection from './config/database';
import * as dotenv from 'dotenv';

dotenv.config();

async function populateMockData() {
  const dbConnection = DatabaseConnection.getInstance();
  const propertyService = new PropertyService();
  
  try {
    console.log('🔗 Testing database connection...');
    await dbConnection.testConnection();
    
    const sources = ['BatDongSan.com.vn', 'Nha.com.vn', 'Alonhadat.com.vn'];
    const propertiesPerSource = 50;
    
    let totalInserted = 0;
    
    for (const source of sources) {
      console.log(`\n📊 Generating mock data for ${source}...`);
      const mockProperties = MockDataGenerator.generateMockProperties(source, propertiesPerSource);
      
      console.log(`💾 Inserting ${mockProperties.length} properties from ${source}...`);
      
      for (const property of mockProperties) {
        try {
          await propertyService.insertProperty(property);
          totalInserted++;
          
          if (totalInserted % 10 === 0) {
            console.log(`   ✅ Inserted ${totalInserted} properties so far...`);
          }
        } catch (error) {
          console.error(`   ❌ Failed to insert property: ${error}`);
        }
      }
      
      console.log(`✅ Completed ${source}: ${mockProperties.length} properties`);
    }
    
    console.log(`\n🎉 Mock data population completed!`);
    console.log(`📈 Total properties inserted: ${totalInserted}`);
    
    // Verify the data
    console.log('\n🔍 Verifying inserted data...');
    const result = await dbConnection.query('SELECT COUNT(*) as total FROM properties');
    console.log(`📊 Total properties in database: ${result.rows[0].total}`);
    
    // Show breakdown by source
    const sourceBreakdown = await dbConnection.query(`
      SELECT source_site, COUNT(*) as count 
      FROM properties 
      GROUP BY source_site 
      ORDER BY source_site
    `);
    
    console.log('\n📋 Properties by source:');
    sourceBreakdown.rows.forEach((row: any) => {
      console.log(`   ${row.source_site}: ${row.count} properties`);
    });
    
  } catch (error) {
    console.error('❌ Error populating mock data:', error);
  } finally {
    await dbConnection.close();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the script
if (require.main === module) {
  populateMockData();
}