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

      // NEW: Handle address conversion fields
      const addressConversionFields = this.getAddressConversionFields(scrapedProperty);

      // Insert property
      let propertyQuery, propertyParams;
      
      // Calculate price per square meter
      const pricePerSqm = scrapedProperty.area.total > 0 ? scrapedProperty.price.amount / scrapedProperty.area.total : null;
      
      if (locationQuery) {
        propertyQuery = `
          INSERT INTO properties (
            title, description, price, price_per_sqm, area, bedrooms, bathrooms, full_address,
            district_id, ward_id, property_type_id, legal_status_id, direction_id,
            project_id, location, source_url, source_site, published_at, last_scraped_at,
            province_new, ward_new, street_new,
            is_address_converted, original_address, converted_address, conversion_error, address_conversion_date
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
            ST_SetSRID(ST_MakePoint($15, $16), 4326), $17, $18, NOW(), NOW(), $19, $20, $21,
            $22, $23, $24, $25, $26
          ) RETURNING id
        `;
        propertyParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          pricePerSqm,
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
          scrapedProperty.street_new || null,
          // NEW: Address conversion fields
          addressConversionFields.isAddressConverted,
          addressConversionFields.originalAddress,
          addressConversionFields.convertedAddress,
          addressConversionFields.conversionError,
          addressConversionFields.conversionDate
        ];
      } else {
        propertyQuery = `
          INSERT INTO properties (
            title, description, price, price_per_sqm, area, bedrooms, bathrooms, full_address,
            district_id, ward_id, property_type_id, legal_status_id, direction_id,
            project_id, source_url, source_site, published_at, last_scraped_at,
            province_new, ward_new, street_new,
            is_address_converted, original_address, converted_address, conversion_error, address_conversion_date
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW(), $17, $18, $19,
            $20, $21, $22, $23, $24
          ) RETURNING id
        `;
        propertyParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          pricePerSqm,
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
          scrapedProperty.street_new || null,
          // NEW: Address conversion fields
          addressConversionFields.isAddressConverted,
          addressConversionFields.originalAddress,
          addressConversionFields.convertedAddress,
          addressConversionFields.conversionError,
          addressConversionFields.conversionDate
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
   * NEW: Extract address conversion fields from scraped property
   */
  private getAddressConversionFields(scrapedProperty: ScrapedProperty): {
    isAddressConverted: boolean;
    originalAddress: string | null;
    convertedAddress: string | null;
    conversionError: string | null;
    conversionDate: Date | null;
  } {
    // Check if the property has address conversion metadata
    const hasConversionData = scrapedProperty as any;
    
    return {
      isAddressConverted: hasConversionData.is_converted || false,
      originalAddress: hasConversionData.original_address || null,
      convertedAddress: hasConversionData.converted_address || null,
      conversionError: hasConversionData.conversion_error || null,
      conversionDate: hasConversionData.is_converted ? new Date() : null
    };
  }

  /**
   * Check if a property has meaningful changes compared to existing record
   */
  async hasPropertyChanged(scrapedProperty: ScrapedProperty): Promise<{ changed: boolean, existingProperty?: any, changes?: string[] }> {
    const client = await this.pool.connect();
    
    try {
      // Check if property exists
      const existingResult = await client.query(
        'SELECT * FROM properties WHERE source_url = $1',
        [scrapedProperty.url]
      );

      if (existingResult.rows.length === 0) {
        return { changed: true }; // New property
      }

      const existing = existingResult.rows[0];
      const changes: string[] = [];

      // Compare key fields
      if (existing.title !== DataProcessor.cleanText(scrapedProperty.title)) {
        changes.push('title');
      }
      
      if (existing.price !== scrapedProperty.price.amount) {
        changes.push('price');
      }
      
      if (existing.area !== scrapedProperty.area.total) {
        changes.push('area');
      }
      
      if (existing.full_address !== DataProcessor.cleanText(scrapedProperty.address.full)) {
        changes.push('address');
      }
      
      if (existing.description !== DataProcessor.cleanText(scrapedProperty.description || '')) {
        changes.push('description');
      }

      // NEW: Check for address conversion changes
      const addressConversionFields = this.getAddressConversionFields(scrapedProperty);
      if (addressConversionFields.isAddressConverted && !existing.is_address_converted) {
        changes.push('address_conversion');
      }

      // Check if any changes detected
      const hasChanges = changes.length > 0;
      
      if (hasChanges) {
        console.log(`Property ${scrapedProperty.url} has changes: ${changes.join(', ')}`);
      } else {
        console.log(`Property ${scrapedProperty.url} unchanged, skipping`);
      }

      return { 
        changed: hasChanges, 
        existingProperty: existing, 
        changes 
      };
    } finally {
      client.release();
    }
  }

  /**
   * Update existing property with new data
   */
  async updateProperty(scrapedProperty: ScrapedProperty): Promise<number | null> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

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

      // NEW: Handle address conversion fields
      const addressConversionFields = this.getAddressConversionFields(scrapedProperty);

      // Calculate price per square meter
      const pricePerSqm = scrapedProperty.area.total > 0 ? scrapedProperty.price.amount / scrapedProperty.area.total : null;

      // Update property
      let updateQuery, updateParams;
      
      if (locationQuery) {
        updateQuery = `
          UPDATE properties SET
            title = $1, description = $2, price = $3, price_per_sqm = $4, area = $5, 
            bedrooms = $6, bathrooms = $7, full_address = $8,
            district_id = $9, ward_id = $10, property_type_id = $11, 
            legal_status_id = $12, direction_id = $13, project_id = $14,
            location = ST_SetSRID(ST_MakePoint($15, $16), 4326),
            last_scraped_at = NOW(), province_new = $17, ward_new = $18, street_new = $19,
            is_address_converted = $20, original_address = $21, converted_address = $22, 
            conversion_error = $23, address_conversion_date = $24
          WHERE source_url = $25
          RETURNING id
        `;
        updateParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          pricePerSqm,
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
          scrapedProperty.province_new || null,
          scrapedProperty.ward_new || null,
          scrapedProperty.street_new || null,
          // NEW: Address conversion fields
          addressConversionFields.isAddressConverted,
          addressConversionFields.originalAddress,
          addressConversionFields.convertedAddress,
          addressConversionFields.conversionError,
          addressConversionFields.conversionDate,
          scrapedProperty.url
        ];
      } else {
        updateQuery = `
          UPDATE properties SET
            title = $1, description = $2, price = $3, price_per_sqm = $4, area = $5, 
            bedrooms = $6, bathrooms = $7, full_address = $8,
            district_id = $9, ward_id = $10, property_type_id = $11, 
            legal_status_id = $12, direction_id = $13, project_id = $14,
            last_scraped_at = NOW(), province_new = $15, ward_new = $16, street_new = $17,
            is_address_converted = $18, original_address = $19, converted_address = $20, 
            conversion_error = $21, address_conversion_date = $22
          WHERE source_url = $23
          RETURNING id
        `;
        updateParams = [
          DataProcessor.cleanText(scrapedProperty.title),
          DataProcessor.cleanText(scrapedProperty.description || ''),
          scrapedProperty.price.amount,
          pricePerSqm,
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
          scrapedProperty.province_new || null,
          scrapedProperty.ward_new || null,
          scrapedProperty.street_new || null,
          // NEW: Address conversion fields
          addressConversionFields.isAddressConverted,
          addressConversionFields.originalAddress,
          addressConversionFields.convertedAddress,
          addressConversionFields.conversionError,
          addressConversionFields.conversionDate,
          scrapedProperty.url
        ];
      }

      const updateResult = await client.query(updateQuery, updateParams);
      const propertyId = updateResult.rows[0]?.id;

      // Update property images if needed
      if (scrapedProperty.images && scrapedProperty.images.length > 0) {
        // Delete existing images and insert new ones
        await client.query('DELETE FROM property_images WHERE property_id = $1', [propertyId]);
        await this.insertPropertyImages(client, propertyId, scrapedProperty.images);
      }

      // Update price history
      await this.insertPriceHistory(client, propertyId, scrapedProperty.price.amount);

      await client.query('COMMIT');
      console.log(`Property updated successfully: ID ${propertyId}`);
      return propertyId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Update only the address conversion fields for a property
   */
  async updateAddressConversionFields(propertyId: number, conversionData: {
    is_converted: boolean;
    original_address: string;
    converted_address: string | null;
    conversion_error: string | null;
    address_conversion_date: Date;
    province_new?: string;
    ward_new?: string;
    street_new?: string;
  }): Promise<void> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE properties SET
          is_address_converted = $1,
          original_address = $2,
          converted_address = $3,
          conversion_error = $4,
          address_conversion_date = $5,
          province_new = COALESCE($6, province_new),
          ward_new = COALESCE($7, ward_new),
          street_new = COALESCE($8, street_new)
        WHERE id = $9
      `;
      
      const updateParams = [
        conversionData.is_converted,
        conversionData.original_address,
        conversionData.converted_address,
        conversionData.conversion_error,
        conversionData.address_conversion_date,
        conversionData.province_new || null,
        conversionData.ward_new || null,
        conversionData.street_new || null,
        propertyId
      ];

      await client.query(updateQuery, updateParams);
      await client.query('COMMIT');
      
    } catch (error) {
      await client.query('ROLLBACK');
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

    // Fallback: Try to find district by ward if district is missing or not found
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
      // Try by province
      if (!districtId && property.address.province) {
        const provinceDistrictResult = await client.query(
          `SELECT d.id FROM districts d
           JOIN provinces p ON d.province_id = p.id
           WHERE LOWER(p.name) LIKE LOWER($1)`,
          [`%${property.address.province}%`]
        );
        if (provinceDistrictResult.rows.length > 0) {
          districtId = provinceDistrictResult.rows[0].id;
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
          'INSERT INTO provinces (name, code) VALUES ($1, $2) RETURNING id',
          ['Unknown', 'unknown']
        );
      }
      const unknownProvinceId = unknownProvince.rows[0].id;
      let unknownDistrict = await client.query(
        'SELECT id FROM districts WHERE name = $1 AND province_id = $2',
        [unknownDistrictName, unknownProvinceId]
      );
      if (unknownDistrict.rows.length === 0) {
        unknownDistrict = await client.query(
          'INSERT INTO districts (name, province_id, code, type) VALUES ($1, $2, $3, $4) RETURNING id',
          [unknownDistrictName, unknownProvinceId, 'unknown', 'Quận']
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
   * Insert price history only if price has changed
   */
  private async insertPriceHistory(client: any, propertyId: string, price: number): Promise<void> {
    // Check if price has changed from the last recorded price
    const lastPriceResult = await client.query(
      'SELECT price FROM price_history WHERE property_id = $1 ORDER BY changed_at DESC LIMIT 1',
      [propertyId]
    );

    // If no previous price record exists, or if price has changed, insert new record
    if (lastPriceResult.rows.length === 0 || lastPriceResult.rows[0].price !== price) {
      await client.query(
        'INSERT INTO price_history (property_id, price) VALUES ($1, $2)',
        [propertyId, price]
      );
      console.log(`Price history updated for property ${propertyId}: ${lastPriceResult.rows[0]?.price || 'N/A'} → ${price}`);
    } else {
      console.log(`Price unchanged for property ${propertyId}: ${price}`);
    }
  }

  /**
   * Get price history for a specific property
   */
  async getPriceHistory(propertyId: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT price, changed_at FROM price_history WHERE property_id = $1 ORDER BY changed_at ASC',
      [propertyId]
    );
    return result.rows;
  }

  /**
   * Get price history for multiple properties
   */
  async getPriceHistoryForProperties(propertyIds: string[]): Promise<any[]> {
    if (propertyIds.length === 0) return [];
    
    const result = await this.pool.query(
      `SELECT ph.price, ph.changed_at, ph.property_id, p.title, p.source_url 
       FROM price_history ph 
       JOIN properties p ON ph.property_id = p.id 
       WHERE ph.property_id = ANY($1) 
       ORDER BY ph.property_id, ph.changed_at ASC`,
      [propertyIds]
    );
    return result.rows;
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