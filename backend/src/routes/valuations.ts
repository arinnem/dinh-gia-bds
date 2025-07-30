import { Router } from 'express';
import { ValuationController } from '../controllers/ValuationController';
import { valuationRateLimiter } from '../middleware';

const router = Router();

// Apply stricter rate limiting to valuation routes
router.use(valuationRateLimiter);

/**
 * @route POST /api/v1/valuations/estimate
 * @desc Estimate property value based on provided parameters
 * @access Public
 * @body {
 *   property_type: string,
 *   area: number,
 *   bedrooms?: number,
 *   bathrooms?: number,
 *   district_id: number,
 *   ward_id?: number,
 *   latitude?: number,
 *   longitude?: number,
 *   features?: string[]
 * }
 * @returns {
 *   estimated_value: number,
 *   confidence_score: number,
 *   valuation_method: string,
 *   comparable_properties: Property[],
 *   market_analysis: {
 *     average_price_per_sqm: number,
 *     market_trend: 'increasing' | 'stable' | 'decreasing',
 *     supply_demand_ratio: number
 *   },
 *   factors: {
 *     location_score: number,
 *     property_condition_score: number,
 *     market_activity_score: number
 *   }
 * }
 */
router.post('/estimate', ValuationController.estimateValue);

/**
 * @route GET /api/v1/valuations/properties/:id
 * @desc Get valuation for an existing property by ID
 * @access Public
 * @param {string} id - Property ID
 * @returns {
 *   property: {
 *     id: string,
 *     title: string,
 *     current_price: number,
 *     area: number,
 *     property_type: string,
 *     address: string
 *   },
 *   valuation: ValuationResponse
 * }
 */
router.get('/properties/:id', ValuationController.getPropertyValuation);

/**
 * @route GET /api/v1/valuations/market-analysis
 * @desc Get market analysis for a specific area
 * @access Public
 * @query {
 *   district_id: number,
 *   property_type: string,
 *   ward_id?: number
 * }
 * @returns {
 *   district_id: number,
 *   ward_id?: number,
 *   property_type: string,
 *   market_analysis: MarketAnalysis,
 *   factors: FactorScores,
 *   sample_valuation: {
 *     estimated_value_per_sqm: number,
 *     confidence_score: number
 *   },
 *   comparable_count: number
 * }
 */
router.get('/market-analysis', ValuationController.getMarketAnalysis);

/**
 * @route GET /api/v1/valuations/properties/:id/history
 * @desc Get valuation history for a property (placeholder for future implementation)
 * @access Public
 * @param {string} id - Property ID
 * @returns {
 *   property_id: string,
 *   valuations: Valuation[],
 *   message: string
 * }
 */
router.get('/properties/:id/history', ValuationController.getValuationHistory);

export default router;