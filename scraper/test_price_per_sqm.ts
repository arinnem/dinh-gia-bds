import { PropertyService } from './src/database/propertyService';

async function testPricePerSqm() {
  const propertyService = new PropertyService();
  
  console.log('Testing price_per_sqm functionality...');
  
  // Test query to see properties with price_per_sqm
  try {
    const result = await propertyService.pool.query(`
      SELECT id, title, price, area, price_per_sqm, 
             CASE WHEN area > 0 THEN ROUND((price / area)::numeric, 2) ELSE NULL END as calculated_price_per_sqm
      FROM properties 
      WHERE price_per_sqm IS NOT NULL 
      ORDER BY id DESC 
      LIMIT 5
    `);
    
    console.log('Properties with price_per_sqm:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title}`);
      console.log(`   Price: ${row.price} VND`);
      console.log(`   Area: ${row.area} m²`);
      console.log(`   Stored price_per_sqm: ${row.price_per_sqm} VND/m²`);
      console.log(`   Calculated price_per_sqm: ${row.calculated_price_per_sqm} VND/m²`);
      console.log('---');
    });
    
    // Check if there are any properties without price_per_sqm
    const missingResult = await propertyService.pool.query(`
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE price_per_sqm IS NULL AND area > 0 AND price > 0
    `);
    
    console.log(`Properties missing price_per_sqm: ${missingResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Error testing price_per_sqm:', error);
  }
  
  await propertyService.pool.end();
}

testPricePerSqm().catch(console.error); 