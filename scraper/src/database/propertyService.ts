import { Pool } from 'pg';
import DatabaseConnection from '../config/database';
import { ScrapedProperty, DatabaseProperty } from '../types';
import { DataProcessor } from '../utils/dataProcessor';

export class PropertyService {
  private db: DatabaseConnection;
  private pool: Pool;

  constructor() {
    this.db = DatabaseConnection.getInstance();
    this.pool = this.db.getPool();
  }

  /**
   * Insert a scraped property into the database
   */
  async insertProperty(scrapedProperty: ScrapedProperty): Promise<number | null> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if property already exists by URL
      const existingProperty = await client.query(
        'SELECT id FROM properties WHERE source_url = $1',
        [scrapedProperty.url]
      );

      if (existingProperty.rows.length > 0) {
        console.log(`Property already exists: ${scrapedProperty.url}`);
        await client.query('ROLLBACK');
        return existingProperty.rows[0].id;
      }

      // Get or create property type
      const propertyTypeId = await this.getOrCreatePropertyType(client, scrapedProperty.propertyType);
      
      // Get or create legal status
      const legalStatusId = scrapedProperty.legalStatus 
        ? await this.getOrCreateLegalStatus(client, scrapedProperty.legalStatus)
        : null;
      
      // Get or create direction
      const directionId = scrapedProperty.direction 
        ? await this.getOrCreateDirection(client, scrapedProperty.direction)
        : null;

      // Get district and ward IDs
      const { districtId, wardId } = await this.getLocationIds(client, scrapedProperty);
      
      // Get or create project
      const projectId = scrapedProperty.projectName 
        ? await this.getOrCreateProject(client, scrapedProperty.projectName, districtId)
        : null;

      // Create PostGIS point if coordinates are available
      let locationQuery = null;
      let locationParams: number[] = [];
      if (scrapedProperty.address.coordinates?.lat && scrapedProperty.address.coordinates?.lng) {
        locationQuery = 'ST_SetSRID(ST_MakePoint($1, $2), 4326)';
        locationParams = [scrapedProperty.address.coordinates.lng, scrapedProperty.address.coordinates.lat];
      }

      // Insert property
      let propertyQuery, propertyParams;
      
      if (locationQuery) {
        propertyQuery = `
          INSERT INTO properties (
            title, description, price, area, bedrooms, bathrooms, full_address,
            district_id, ward_id, property_type_id, legal_status_id, direction_id,
            project_id, location, source_url, source_site, published_at, last_scraped_at,
            province_new, ward_new, street_new
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
            ST_SetSRID(ST_MakePoint($14, $15), 4326), $16, $17, NOW(), NOW(), $18, $19, $20
          ) RETURNING id
        `;
        propertyParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          scrapedProperty.area.total,
          scrapedProperty.features.bedrooms,
          scrapedProperty.features.bathrooms,
          DataProcessor.cleanText(scrapedProperty.address.full),
          districtId,
          wardId,
          propertyTypeId,
          legalStatusId,
          directionId,
          projectId,
          locationParams[0], // longitude
          locationParams[1], // latitude
          scrapedProperty.url,
          scrapedProperty.source,
          scrapedProperty.province_new || null,
          scrapedProperty.ward_new || null,
          scrapedProperty.street_new || null
        ];
      } else {
        propertyQuery = `
          INSERT INTO properties (
            title, description, price, area, bedrooms, bathrooms, full_address,
            district_id, ward_id, property_type_id, legal_status_id, direction_id,
            project_id, source_url, source_site, published_at, last_scraped_at,
            province_new, ward_new, street_new
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW(), $16, $17, $18
          ) RETURNING id
        `;
        propertyParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          scrapedProperty.area.total,
          scrapedProperty.features.bedrooms,
          scrapedProperty.features.bathrooms,
          DataProcessor.cleanText(scrapedProperty.address.full),
          districtId,
          wardId,
          propertyTypeId,
          legalStatusId,
          directionId,
          projectId,
          scrapedProperty.url,
          scrapedProperty.source,
          scrapedProperty.province_new || null,
          scrapedProperty.ward_new || null,
          scrapedProperty.street_new || null
        ];
      }



      const propertyResult = await client.query(propertyQuery, propertyParams);
      const propertyId = propertyResult.rows[0].id;

      // Insert property images
      if (scrapedProperty.images && scrapedProperty.images.length > 0) {
        await this.insertPropertyImages(client, propertyId, scrapedProperty.images);
      }

      // Insert price history
      await this.insertPriceHistory(client, propertyId, scrapedProperty.price.amount);

      await client.query('COMMIT');
      console.log(`Property inserted successfully: ID ${propertyId}`);
      return propertyId;

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting property:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get or create property type
   */
  private async getOrCreatePropertyType(client: any, typeName: string): Promise<number> {
    const cleanTypeName = DataProcessor.cleanText(typeName);
    
    // Try to find existing type
    const existingType = await client.query(
      'SELECT id FROM property_types WHERE LOWER(name) = LOWER($1)',
      [cleanTypeName]
    );

    if (existingType.rows.length > 0) {
      return existingType.rows[0].id;
    }

    // Create new type
    const newType = await client.query(
      'INSERT INTO property_types (name) VALUES ($1) RETURNING id',
      [cleanTypeName]
    );

    return newType.rows[0].id;
  }

  /**
   * Get or create legal status
   */
  private async getOrCreateLegalStatus(client: any, statusName: string): Promise<number> {
    const cleanStatusName = DataProcessor.cleanText(statusName);
    
    const existingStatus = await client.query(
      'SELECT id FROM legal_statuses WHERE LOWER(name) = LOWER($1)',
      [cleanStatusName]
    );

    if (existingStatus.rows.length > 0) {
      return existingStatus.rows[0].id;
    }

    const newStatus = await client.query(
      'INSERT INTO legal_statuses (name) VALUES ($1) RETURNING id',
      [cleanStatusName]
    );

    return newStatus.rows[0].id;
  }

  /**
   * Get or create direction
   */
  private async getOrCreateDirection(client: any, directionName: string): Promise<number> {
    const cleanDirectionName = DataProcessor.cleanText(directionName);
    
    const existingDirection = await client.query(
      'SELECT id FROM directions WHERE LOWER(name) = LOWER($1)',
      [cleanDirectionName]
    );

    if (existingDirection.rows.length > 0) {
      return existingDirection.rows[0].id;
    }

    const newDirection = await client.query(
      'INSERT INTO directions (name) VALUES ($1) RETURNING id',
      [cleanDirectionName]
    );

    return newDirection.rows[0].id;
  }

  /**
   * Get district and ward IDs from address
   */
  private async getLocationIds(client: any, property: ScrapedProperty): Promise<{ districtId: number | null, wardId: number | null }> {
    let districtId = null;
    let wardId = null;

    // Try to find district by name
    if (property.address.district) {
      const districtResult = await client.query(
        'SELECT id FROM districts WHERE LOWER(name) LIKE LOWER($1) OR LOWER($1) LIKE LOWER(name)',
        [`%${property.address.district}%`]
      );
      if (districtResult.rows.length > 0) {
        districtId = districtResult.rows[0].id;
      }
    }

    // Fallback: Try to find district by ward or city if district is missing or not found
    if (!districtId) {
      // Try by ward
      if (property.address.ward) {
        const wardDistrictResult = await client.query(
          `SELECT d.id FROM districts d
           JOIN wards w ON w.district_id = d.id
           WHERE LOWER(w.name) LIKE LOWER($1)`,
          [`%${property.address.ward}%`]
        );
        if (wardDistrictResult.rows.length > 0) {
          districtId = wardDistrictResult.rows[0].id;
        }
      }
      // Try by city (if your schema has a city column in districts)
      if (!districtId && property.address.city) {
        const cityDistrictResult = await client.query(
          `SELECT id FROM districts WHERE LOWER(city) LIKE LOWER($1)`,
          [`%${property.address.city}%`]
        );
        if (cityDistrictResult.rows.length > 0) {
          districtId = cityDistrictResult.rows[0].id;
        }
      }
    }

    // Fallback: Use or create a default 'Unknown' district
    if (!districtId) {
      const unknownDistrictName = 'Unknown';
      // Find or create the 'Unknown' province
      let unknownProvince = await client.query(
        'SELECT id FROM provinces WHERE name = $1',
        ['Unknown']
      );
      if (unknownProvince.rows.length === 0) {
        unknownProvince = await client.query(
          'INSERT INTO provinces (name) VALUES ($1) RETURNING id',
          ['Unknown']
        );
      }
      const unknownProvinceId = unknownProvince.rows[0].id;
      let unknownDistrict = await client.query(
        'SELECT id FROM districts WHERE name = $1 AND province = $2',
        [unknownDistrictName, unknownProvinceId]
      );
      if (unknownDistrict.rows.length === 0) {
        unknownDistrict = await client.query(
          'INSERT INTO districts (name, province) VALUES ($1, $2) RETURNING id',
          [unknownDistrictName, unknownProvinceId]
        );
      }
      districtId = unknownDistrict.rows[0].id;
    }

    // Try to find ward by name and district
    if (property.address.ward && districtId) {
      const wardResult = await client.query(
        'SELECT id FROM wards WHERE LOWER(name) LIKE LOWER($1) AND district_id = $2',
        [`%${property.address.ward}%`, districtId]
      );
      if (wardResult.rows.length > 0) {
        wardId = wardResult.rows[0].id;
      }
    }

    return { districtId, wardId };
  }

  /**
   * Get or create project
   */
  private async getOrCreateProject(client: any, projectName: string, districtId: number | null): Promise<number> {
    const cleanProjectName = DataProcessor.cleanText(projectName);
    
    const existingProject = await client.query(
      'SELECT id FROM projects WHERE LOWER(name) = LOWER($1)',
      [cleanProjectName]
    );

    if (existingProject.rows.length > 0) {
      return existingProject.rows[0].id;
    }

    const newProject = await client.query(
      'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING id',
      [cleanProjectName, `Auto-created from scraping: ${cleanProjectName}`]
    );

    return newProject.rows[0].id;
  }

  /**
   * Insert property images
   */
  private async insertPropertyImages(client: any, propertyId: string, images: string[]): Promise<void> {
    for (let i = 0; i < images.length; i++) {
      await client.query(
        'INSERT INTO property_images (property_id, image_url, is_thumbnail) VALUES ($1, $2, $3)',
        [propertyId, images[i], i === 0] // First image is thumbnail
      );
    }
  }

  /**
   * Insert price history
   */
  private async insertPriceHistory(client: any, propertyId: string, price: number): Promise<void> {
    await client.query(
      'INSERT INTO price_history (property_id, price) VALUES ($1, $2)',
      [propertyId, price]
    );
  }

  /**
   * Get property statistics
   */
  async getPropertyStats(): Promise<any> {
    const result = await this.pool.query(`
      SELECT 
        COUNT(*) as total_properties,
        COUNT(DISTINCT source_site) as total_sources,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        AVG(area) as avg_area
      FROM properties
    `);

    return result.rows[0];
  }

  /**
   * Get properties by source site
   */
  async getPropertiesBySource(sourceSite: string, limit: number = 10): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM properties WHERE source_site = $1 ORDER BY created_at DESC LIMIT $2',
      [sourceSite, limit]
    );

    return result.rows;
  }
}