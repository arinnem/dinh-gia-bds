import { Request, Response } from 'express';
import { ValuationService } from '../services/ValuationService';
import { ValuationRequest, ApiResponse } from '../types';
import Joi from 'joi';

// Validation schema for valuation requests
const valuationSchema = Joi.object({
  property_type: Joi.string().required().messages({
    'any.required': 'Property type is required',
    'string.empty': 'Property type cannot be empty'
  }),
  area: Joi.number().positive().required().messages({
    'any.required': 'Area is required',
    'number.positive': 'Area must be a positive number'
  }),
  bedrooms: Joi.number().integer().min(0).optional(),
  bathrooms: Joi.number().integer().min(0).optional(),
  district_id: Joi.number().integer().positive().required().messages({
    'any.required': 'District ID is required',
    'number.positive': 'District ID must be a positive number'
  }),
  ward_id: Joi.number().integer().positive().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  features: Joi.array().items(Joi.string()).optional()
});

export class ValuationController {
  /**
   * Estimate property value based on provided parameters
   */
  static async estimateValue(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { error, value } = valuationSchema.validate(req.body);
      
      if (error) {
        const response: ApiResponse = {
          success: false,
          error: error.details[0].message,
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const valuationRequest: ValuationRequest = value;
      
      // Perform valuation
      const valuation = await ValuationService.estimateValue(valuationRequest);
      
      const response: ApiResponse = {
        success: true,
        data: valuation,
        message: 'Property valuation completed successfully',
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error in property valuation:', error);
      
      let errorMessage = 'Failed to estimate property value';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message.includes('No comparable properties')) {
          errorMessage = 'Insufficient comparable properties found for accurate valuation';
          statusCode = 422;
        } else {
          errorMessage = error.message;
        }
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }

  /**
   * Get valuation for an existing property by ID
   */
  static async getPropertyValuation(req: Request, res: Response): Promise<void> {
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

      // Get property details first
      const { PropertyModel } = await import('../models/Property');
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

      // Create valuation request from property data
      const valuationRequest: ValuationRequest = {
        property_type: property.property_type,
        area: property.area,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        district_id: property.district_id,
        ward_id: property.ward_id,
        latitude: property.latitude,
        longitude: property.longitude,
        features: property.features
      };
      
      // Perform valuation
      const valuation = await ValuationService.estimateValue(valuationRequest);
      
      const response: ApiResponse = {
        success: true,
        data: {
          property: {
            id: property.id,
            title: property.title,
            current_price: property.price,
            area: property.area,
            property_type: property.property_type,
            address: property.address
          },
          valuation
        },
        message: 'Property valuation completed successfully',
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting property valuation:', error);
      
      let errorMessage = 'Failed to get property valuation';
      let statusCode = 500;
      
      if (error instanceof Error) {
        if (error.message.includes('No comparable properties')) {
          errorMessage = 'Insufficient comparable properties found for accurate valuation';
          statusCode = 422;
        } else {
          errorMessage = error.message;
        }
      }
      
      const response: ApiResponse = {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      };
      
      res.status(statusCode).json(response);
    }
  }

  /**
   * Get market analysis for a specific area
   */
  static async getMarketAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const district_id = req.query.district_id ? parseInt(req.query.district_id as string) : undefined;
      const property_type = req.query.property_type as string;
      const ward_id = req.query.ward_id ? parseInt(req.query.ward_id as string) : undefined;
      
      if (!district_id || !property_type) {
        const response: ApiResponse = {
          success: false,
          error: 'District ID and property type are required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      // Create a sample valuation request for market analysis
      const sampleRequest: ValuationRequest = {
        property_type,
        area: 100, // Sample area for analysis
        district_id,
        ward_id
      };
      
      // Get market analysis through valuation service
      const valuation = await ValuationService.estimateValue(sampleRequest);
      
      const response: ApiResponse = {
        success: true,
        data: {
          district_id,
          ward_id,
          property_type,
          market_analysis: valuation.market_analysis,
          factors: valuation.factors,
          sample_valuation: {
            estimated_value_per_sqm: Math.round(valuation.estimated_value / 100),
            confidence_score: valuation.confidence_score
          },
          comparable_count: valuation.comparable_properties.length
        },
        message: 'Market analysis completed successfully',
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting market analysis:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get market analysis',
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(response);
    }
  }

  /**
   * Get valuation history for a property (placeholder for future implementation)
   */
  static async getValuationHistory(req: Request, res: Response): Promise<void> {
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

      // For now, return empty history as this feature is not yet implemented
      const response: ApiResponse = {
        success: true,
        data: {
          property_id: id,
          valuations: [],
          message: 'Valuation history feature coming soon'
        },
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting valuation history:', error);
      
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get valuation history',
        timestamp: new Date().toISOString()
      };
      
      res.status(500).json(response);
    }
  }
}