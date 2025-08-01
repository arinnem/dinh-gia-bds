"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyService = void 0;
const database_1 = __importDefault(require("../config/database"));
const dataProcessor_1 = require("../utils/dataProcessor");
class PropertyService {
    constructor() {
        this.db = database_1.default.getInstance();
        this.pool = this.db.getPool();
    }
    /**
     * Insert a scraped property into the database
     */
    async insertProperty(scrapedProperty) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            // Check if property already exists by URL
            const existingProperty = await client.query('SELECT id FROM properties WHERE source_url = $1', [scrapedProperty.url]);
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
            let locationParams = [];
            if (scrapedProperty.address.coordinates?.lat && scrapedProperty.address.coordinates?.lng) {
                locationQuery = 'ST_SetSRID(ST_MakePoint($1, $2), 4326)';
                locationParams = [scrapedProperty.address.coordinates.lng, scrapedProperty.address.coordinates.lat];
            }
            // Insert property
            const propertyQuery = `
        INSERT INTO properties (
          title, description, price, area, bedrooms, bathrooms, address,
          district_id, ward_id, property_type_id, legal_status_id, direction_id,
          project_id, location, source_url, source_site, contact_phone, contact_name,
          posted_date, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
          ${locationQuery ? locationQuery : 'NULL'}, $14, $15, $16, $17, $18, NOW(), NOW()
        ) RETURNING id
      `;
            const propertyParams = [
                dataProcessor_1.DataProcessor.cleanText(scrapedProperty.title),
                dataProcessor_1.DataProcessor.cleanText(scrapedProperty.description || ''),
                scrapedProperty.price.amount,
                scrapedProperty.area.total,
                scrapedProperty.features.bedrooms,
                scrapedProperty.features.bathrooms,
                dataProcessor_1.DataProcessor.cleanText(scrapedProperty.address.full),
                districtId,
                wardId,
                propertyTypeId,
                legalStatusId,
                directionId,
                projectId,
                scrapedProperty.url,
                scrapedProperty.source,
                scrapedProperty.contact.phone,
                dataProcessor_1.DataProcessor.cleanText(scrapedProperty.contact.name || ''),
                scrapedProperty.postedDate || new Date(),
                ...locationParams
            ];
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
        }
        catch (error) {
            await client.query('ROLLBACK');
            console.error('Error inserting property:', error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    /**
     * Get or create property type
     */
    async getOrCreatePropertyType(client, typeName) {
        const cleanTypeName = dataProcessor_1.DataProcessor.cleanText(typeName);
        // Try to find existing type
        const existingType = await client.query('SELECT id FROM property_types WHERE LOWER(name) = LOWER($1)', [cleanTypeName]);
        if (existingType.rows.length > 0) {
            return existingType.rows[0].id;
        }
        // Create new type
        const newType = await client.query('INSERT INTO property_types (name, description, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id', [cleanTypeName, `Auto-created from scraping: ${cleanTypeName}`]);
        return newType.rows[0].id;
    }
    /**
     * Get or create legal status
     */
    async getOrCreateLegalStatus(client, statusName) {
        const cleanStatusName = dataProcessor_1.DataProcessor.cleanText(statusName);
        const existingStatus = await client.query('SELECT id FROM legal_statuses WHERE LOWER(name) = LOWER($1)', [cleanStatusName]);
        if (existingStatus.rows.length > 0) {
            return existingStatus.rows[0].id;
        }
        const newStatus = await client.query('INSERT INTO legal_statuses (name, description, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id', [cleanStatusName, `Auto-created from scraping: ${cleanStatusName}`]);
        return newStatus.rows[0].id;
    }
    /**
     * Get or create direction
     */
    async getOrCreateDirection(client, directionName) {
        const cleanDirectionName = dataProcessor_1.DataProcessor.cleanText(directionName);
        const existingDirection = await client.query('SELECT id FROM directions WHERE LOWER(name) = LOWER($1)', [cleanDirectionName]);
        if (existingDirection.rows.length > 0) {
            return existingDirection.rows[0].id;
        }
        const newDirection = await client.query('INSERT INTO directions (name, description, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id', [cleanDirectionName, `Auto-created from scraping: ${cleanDirectionName}`]);
        return newDirection.rows[0].id;
    }
    /**
     * Get district and ward IDs from address
     */
    async getLocationIds(client, property) {
        let districtId = null;
        let wardId = null;
        // Try to find district by name
        if (property.address.district) {
            const districtResult = await client.query('SELECT id FROM districts WHERE LOWER(name) LIKE LOWER($1) OR LOWER($1) LIKE LOWER(name)', [`%${property.address.district}%`]);
            if (districtResult.rows.length > 0) {
                districtId = districtResult.rows[0].id;
            }
        }
        // Try to find ward by name and district
        if (property.address.ward && districtId) {
            const wardResult = await client.query('SELECT id FROM wards WHERE LOWER(name) LIKE LOWER($1) AND district_id = $2', [`%${property.address.ward}%`, districtId]);
            if (wardResult.rows.length > 0) {
                wardId = wardResult.rows[0].id;
            }
        }
        return { districtId, wardId };
    }
    /**
     * Get or create project
     */
    async getOrCreateProject(client, projectName, districtId) {
        const cleanProjectName = dataProcessor_1.DataProcessor.cleanText(projectName);
        const existingProject = await client.query('SELECT id FROM projects WHERE LOWER(name) = LOWER($1)', [cleanProjectName]);
        if (existingProject.rows.length > 0) {
            return existingProject.rows[0].id;
        }
        const newProject = await client.query('INSERT INTO projects (name, description, district_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id', [cleanProjectName, `Auto-created from scraping: ${cleanProjectName}`, districtId]);
        return newProject.rows[0].id;
    }
    /**
     * Insert property images
     */
    async insertPropertyImages(client, propertyId, images) {
        for (let i = 0; i < images.length; i++) {
            await client.query('INSERT INTO property_images (property_id, image_url, alt_text, display_order, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())', [propertyId, images[i], `Property image ${i + 1}`, i + 1]);
        }
    }
    /**
     * Insert price history
     */
    async insertPriceHistory(client, propertyId, price) {
        await client.query('INSERT INTO price_history (property_id, price, recorded_date, source, created_at, updated_at) VALUES ($1, $2, NOW(), $3, NOW(), NOW())', [propertyId, price, 'scraper']);
    }
    /**
     * Get property statistics
     */
    async getPropertyStats() {
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
    async getPropertiesBySource(sourceSite, limit = 10) {
        const result = await this.pool.query('SELECT * FROM properties WHERE source_site = $1 ORDER BY created_at DESC LIMIT $2', [sourceSite, limit]);
        return result.rows;
    }
}
exports.PropertyService = PropertyService;
//# sourceMappingURL=propertyService.js.map