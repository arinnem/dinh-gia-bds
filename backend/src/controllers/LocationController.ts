import { Request, Response } from 'express';
import { LocationModel } from '../models/Location';
import { ApiResponse } from '../types';

export class LocationController {
  /**
   * Get all cities
   */
  static async getCities(req: Request, res: Response): Promise<void> {
    try {
      const cities = await LocationModel.getAllCities();
      
      const response: ApiResponse = {
        success: true,
        data: cities,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting cities:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get cities',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get city by ID
   */
  static async getCityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cityId = parseInt(id);
      
      if (isNaN(cityId)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid city ID',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const city = await LocationModel.getCityById(cityId);
      
      if (!city) {
        const response: ApiResponse = {
          success: false,
          error: 'City not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: city,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting city by ID:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get city',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all districts or districts by city
   */
  static async getDistricts(req: Request, res: Response): Promise<void> {
    try {
      const cityId = req.query.city_id ? parseInt(req.query.city_id as string) : undefined;
      
      let districts;
      if (cityId) {
        if (isNaN(cityId)) {
          const response: ApiResponse = {
            success: false,
            error: 'Invalid city ID',
            timestamp: new Date().toISOString()
          };
          res.status(400).json(response);
          return;
        }
        districts = await LocationModel.getDistrictsByCity(cityId);
      } else {
        districts = await LocationModel.getAllDistricts();
      }
      
      const response: ApiResponse = {
        success: true,
        data: districts,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting districts:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get districts',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get district by ID
   */
  static async getDistrictById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const districtId = parseInt(id);
      
      if (isNaN(districtId)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid district ID',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const district = await LocationModel.getDistrictById(districtId);
      
      if (!district) {
        const response: ApiResponse = {
          success: false,
          error: 'District not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: district,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting district by ID:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get district',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all wards or wards by district
   */
  static async getWards(req: Request, res: Response): Promise<void> {
    try {
      const districtId = req.query.district_id ? parseInt(req.query.district_id as string) : undefined;
      
      let wards;
      if (districtId) {
        if (isNaN(districtId)) {
          const response: ApiResponse = {
            success: false,
            error: 'Invalid district ID',
            timestamp: new Date().toISOString()
          };
          res.status(400).json(response);
          return;
        }
        wards = await LocationModel.getWardsByDistrict(districtId);
      } else {
        wards = await LocationModel.getAllWards();
      }
      
      const response: ApiResponse = {
        success: true,
        data: wards,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting wards:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get wards',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get ward by ID
   */
  static async getWardById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const wardId = parseInt(id);
      
      if (isNaN(wardId)) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid ward ID',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const ward = await LocationModel.getWardById(wardId);
      
      if (!ward) {
        const response: ApiResponse = {
          success: false,
          error: 'Ward not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: ward,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting ward by ID:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get ward',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Search locations by name
   */
  static async searchLocations(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        const response: ApiResponse = {
          success: false,
          error: 'Search query must be at least 2 characters long',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const results = await LocationModel.searchLocations(q.trim());
      
      const response: ApiResponse = {
        success: true,
        data: results,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error searching locations:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to search locations',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get complete location hierarchy
   */
  static async getLocationHierarchy(req: Request, res: Response): Promise<void> {
    try {
      const hierarchy = await LocationModel.getLocationHierarchy();
      
      const response: ApiResponse = {
        success: true,
        data: hierarchy,
        timestamp: new Date().toISOString()
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting location hierarchy:', error);
      const response: ApiResponse = {
        success: false,
        error: 'Failed to get location hierarchy',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}