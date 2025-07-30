import { Router } from 'express';
import { healthCheck } from '../middleware';
import propertiesRoutes from './properties';
import valuationsRoutes from './valuations';
import locationsRoutes from './locations';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// API routes
router.use('/properties', propertiesRoutes);
router.use('/valuations', valuationsRoutes);
router.use('/locations', locationsRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'Real Estate Valuation API',
      version: '1.0.0',
      description: 'API for real estate property search and valuation',
      endpoints: {
        properties: {
          'GET /properties': 'Search properties with filters and pagination',
          'GET /properties/stats': 'Get property statistics',
          'GET /properties/:id': 'Get property by ID',
          'GET /properties/:id/comparables': 'Get comparable properties'
        },
        valuations: {
          'POST /valuations/estimate': 'Estimate property value',
          'GET /valuations/properties/:id': 'Get valuation for existing property',
          'GET /valuations/market-analysis': 'Get market analysis for area',
          'GET /valuations/properties/:id/history': 'Get valuation history (coming soon)'
        },
        locations: {
          'GET /locations/cities': 'Get all cities',
          'GET /locations/cities/:id': 'Get city by ID',
          'GET /locations/districts': 'Get districts (optionally by city)',
          'GET /locations/districts/:id': 'Get district by ID',
          'GET /locations/wards': 'Get wards (optionally by district)',
          'GET /locations/wards/:id': 'Get ward by ID',
          'GET /locations/search': 'Search locations by name',
          'GET /locations/hierarchy': 'Get complete location hierarchy'
        },
        system: {
          'GET /health': 'Health check endpoint',
          'GET /docs': 'API documentation'
        }
      },
      examples: {
        property_search: {
          url: '/api/v1/properties?property_type=apartment&district_id=1&min_price=1000000&max_price=5000000&page=1&limit=20',
          description: 'Search for apartments in district 1 with price range 1M-5M VND'
        },
        valuation_estimate: {
          url: '/api/v1/valuations/estimate',
          method: 'POST',
          body: {
            property_type: 'apartment',
            area: 80,
            bedrooms: 2,
            bathrooms: 2,
            district_id: 1,
            features: ['balcony', 'parking']
          },
          description: 'Estimate value for an 80sqm apartment with 2BR/2BA in district 1'
        },
        market_analysis: {
          url: '/api/v1/valuations/market-analysis?district_id=1&property_type=apartment',
          description: 'Get market analysis for apartments in district 1'
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

export default router;