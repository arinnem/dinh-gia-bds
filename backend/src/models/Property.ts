import { pool } from '../config/database';
import { Property, PropertySearchQuery } from '../types';

export class PropertyModel {
  static async findById(id: string): Promise<Property | null> {
    try {
      const query = `
        SELECT p.*, d.name as district_name, w.name as ward_name, c.name as city_name
        FROM properties p
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN wards w ON p.ward_id = w.id
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE p.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding property by ID:', error);
      throw error;
    }
  }

  static async search(params: PropertySearchQuery): Promise<{ properties: Property[]; total: number }> {
    try {
      const {
        q,
        property_type,
        listing_type,
        min_price,
        max_price,
        min_area,
        max_area,
        bedrooms,
        bathrooms,
        district_id,
        ward_id,
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = params;

      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Build WHERE conditions
      if (q) {
        conditions.push(`(p.title ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.address ILIKE $${paramIndex})`);
        values.push(`%${q}%`);
        paramIndex++;
      }

      if (property_type) {
        conditions.push(`p.property_type = $${paramIndex}`);
        values.push(property_type);
        paramIndex++;
      }

      if (listing_type) {
        conditions.push(`p.listing_type = $${paramIndex}`);
        values.push(listing_type);
        paramIndex++;
      }

      if (min_price !== undefined) {
        conditions.push(`p.price >= $${paramIndex}`);
        values.push(min_price);
        paramIndex++;
      }

      if (max_price !== undefined) {
        conditions.push(`p.price <= $${paramIndex}`);
        values.push(max_price);
        paramIndex++;
      }

      if (min_area !== undefined) {
        conditions.push(`p.area >= $${paramIndex}`);
        values.push(min_area);
        paramIndex++;
      }

      if (max_area !== undefined) {
        conditions.push(`p.area <= $${paramIndex}`);
        values.push(max_area);
        paramIndex++;
      }

      if (bedrooms !== undefined) {
        conditions.push(`p.bedrooms = $${paramIndex}`);
        values.push(bedrooms);
        paramIndex++;
      }

      if (bathrooms !== undefined) {
        conditions.push(`p.bathrooms = $${paramIndex}`);
        values.push(bathrooms);
        paramIndex++;
      }

      if (district_id !== undefined) {
        conditions.push(`p.district_id = $${paramIndex}`);
        values.push(district_id);
        paramIndex++;
      }

      if (ward_id !== undefined) {
        conditions.push(`p.ward_id = $${paramIndex}`);
        values.push(ward_id);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const orderClause = `ORDER BY p.${sort_by} ${sort_order.toUpperCase()}`;
      const offset = (page - 1) * limit;

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total
        FROM properties p
        ${whereClause}
      `;
      const countResult = await pool.query(countQuery, values);
      const total = parseInt(countResult.rows[0].total);

      // Get properties
      const query = `
        SELECT p.*, d.name as district_name, w.name as ward_name, c.name as city_name
        FROM properties p
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN wards w ON p.ward_id = w.id
        LEFT JOIN cities c ON d.city_id = c.id
        ${whereClause}
        ${orderClause}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      const result = await pool.query(query, values);

      return {
        properties: result.rows,
        total
      };
    } catch (error) {
      console.error('Error searching properties:', error);
      throw error;
    }
  }

  static async getPropertyTypes(): Promise<string[]> {
    try {
      const query = 'SELECT DISTINCT property_type FROM properties ORDER BY property_type';
      const result = await pool.query(query);
      return result.rows.map(row => row.property_type);
    } catch (error) {
      console.error('Error getting property types:', error);
      throw error;
    }
  }

  static async getPriceRange(): Promise<{ min: number; max: number }> {
    try {
      const query = 'SELECT MIN(price) as min, MAX(price) as max FROM properties WHERE price > 0';
      const result = await pool.query(query);
      return {
        min: parseFloat(result.rows[0].min) || 0,
        max: parseFloat(result.rows[0].max) || 0
      };
    } catch (error) {
      console.error('Error getting price range:', error);
      throw error;
    }
  }

  static async getAreaRange(): Promise<{ min: number; max: number }> {
    try {
      const query = 'SELECT MIN(area) as min, MAX(area) as max FROM properties WHERE area > 0';
      const result = await pool.query(query);
      return {
        min: parseFloat(result.rows[0].min) || 0,
        max: parseFloat(result.rows[0].max) || 0
      };
    } catch (error) {
      console.error('Error getting area range:', error);
      throw error;
    }
  }

  static async getComparableProperties(
    property_type: string,
    district_id: number,
    area: number,
    limit: number = 10
  ): Promise<Property[]> {
    try {
      const query = `
        SELECT p.*, d.name as district_name, w.name as ward_name
        FROM properties p
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN wards w ON p.ward_id = w.id
        WHERE p.property_type = $1 
        AND p.district_id = $2
        AND p.area BETWEEN $3 * 0.7 AND $3 * 1.3
        AND p.price > 0
        ORDER BY ABS(p.area - $3), p.created_at DESC
        LIMIT $4
      `;
      const result = await pool.query(query, [property_type, district_id, area, limit]);
      return result.rows;
    } catch (error) {
      console.error('Error getting comparable properties:', error);
      throw error;
    }
  }
}