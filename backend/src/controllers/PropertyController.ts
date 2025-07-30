import { Request, Response } from 'express';
import { PropertyModel } from '../models/Property';
import { LocationModel } from '../models/Location';
import { PropertySearchQuery, ApiResponse } from '../types';
import { pool } from '../config/database';

export class PropertyController {
  /**
   * Search properties with filters and pagination
   */
  static async searchProperties(req: Request, res: Response): Promise<void> {
    try {
      const searchParams: PropertySearchQuery = {
        q: req.query.q as string,
        property_type: req.query.property_type as string,
        listing_type: req.query.listing_type as 'sale' | 'rent',
        min_price: req.query.min_price ? parseFloat(req.query.min_price as string) : undefined,
        max_price: req.query.max_price ? parseFloat(req.query.max_price as string) : undefined,
        min_area: req.query.min_area ? parseFloat(req.query.min_area as string) : undefined,
        max_area: req.query.max_area ? parseFloat(req.query.max_area as string) : undefined,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
        district_id: req.query.district_id ? parseInt(req.query.district_id as string) : undefined,
        ward_id: req.query.ward_id ? parseInt(req.query.ward_id as string) : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 20,
        sort_by: req.query.sort_by as 'price' | 'area' | 'created_at' || 'created_at',
        sort_order: req.query.sort_order as 'asc' | 'desc' || 'desc'
      };

      // Validate pagination
      if (searchParams.page! < 1) searchParams.page = 1;
      if (searchParams.limit! < 1) searchParams.limit = 20;

      const { properties, total } = await PropertyModel.search(searchParams);
      
      // Get filter options
      const [propertyTypes, districts, priceRange, areaRange] = await Promise.all([
        PropertyModel.getPropertyTypes(),
        LocationModel.getAllDistricts(),
        PropertyModel.getPriceRange(),
        PropertyModel.getAreaRange()
      ]);

      const response: ApiResponse = {
        success: true,
        data: {
          properties,
          pagination: {
            page: searchParams.page!,
            limit: searchParams.limit!,
            total,
            total_pages: Math.ceil(total / searchParams.limit!)
          },
          filters: {
            applied: searchParams,
            available: {
              property_types: propertyTypes,
              districts,
              price_range: priceRange,
              area_range: areaRange
            }
          }
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error searching properties:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to search properties',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Property ID is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const property = await PropertyModel.findById(id);
      
      if (!property) {
        const response: ApiResponse = {
          success: false,
          error: 'Property not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: property,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting property by ID:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get property',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get comparable properties for a given property
   */
  static async getComparableProperties(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 20) : 10;
      
      if (!id) {
        const response: ApiResponse = {
          success: false,
          error: 'Property ID is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      // Get the base property
      const baseProperty = await PropertyModel.findById(id);
      if (!baseProperty) {
        const response: ApiResponse = {
          success: false,
          error: 'Property not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      // Get comparable properties
      const comparables = await PropertyModel.getComparableProperties(
        baseProperty.property_type,
        baseProperty.district_id,
        baseProperty.area,
        limit
      );

      const response: ApiResponse = {
        success: true,
        data: {
          base_property: baseProperty,
          comparable_properties: comparables,
          total: comparables.length
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting comparable properties:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get comparable properties',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get property statistics
   */
  static async getPropertyStats(req: Request, res: Response): Promise<void> {
    try {
      const district_id = req.query.district_id ? parseInt(req.query.district_id as string) : undefined;
      const property_type = req.query.property_type as string;
      
      // Build query conditions
      const conditions: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (district_id) {
        conditions.push(`district_id = $${paramIndex}`);
        values.push(district_id);
        paramIndex++;
      }

      if (property_type) {
        conditions.push(`property_type = $${paramIndex}`);
        values.push(property_type);
        paramIndex++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const query = `
        SELECT 
          COUNT(*) as total_properties,
          AVG(price) as avg_price,
          MIN(price) as min_price,
          MAX(price) as max_price,
          AVG(area) as avg_area,
          MIN(area) as min_area,
          MAX(area) as max_area,
          AVG(price / NULLIF(area, 0)) as avg_price_per_sqm
        FROM properties 
        ${whereClause}
        AND price > 0 AND area > 0
      `;

      const result = await pool.query(query, values);
      const stats = result.rows[0];

      const response: ApiResponse = {
        success: true,
        data: {
          total_properties: parseInt(stats.total_properties) || 0,
          price_stats: {
            average: parseFloat(stats.avg_price) || 0,
            minimum: parseFloat(stats.min_price) || 0,
            maximum: parseFloat(stats.max_price) || 0
          },
          area_stats: {
            average: parseFloat(stats.avg_area) || 0,
            minimum: parseFloat(stats.min_area) || 0,
            maximum: parseFloat(stats.max_area) || 0
          },
          avg_price_per_sqm: parseFloat(stats.avg_price_per_sqm) || 0,
          filters: {
            district_id,
            property_type
          }
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting property stats:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get property statistics',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}