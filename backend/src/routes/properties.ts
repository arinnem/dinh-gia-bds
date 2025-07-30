import { Router } from 'express';
import { PropertyController } from '../controllers/PropertyController';
import { rateLimiter } from '../middleware';

const router = Router();

// Apply rate limiting to all property routes
router.use(rateLimiter);

/**
 * @route GET /api/v1/properties
 * @desc Search properties with filters and pagination
 * @access Public
 * @query {
 *   q?: string,
 *   property_type?: string,
 *   listing_type?: 'sale' | 'rent',
 *   min_price?: number,
 *   max_price?: number,
 *   min_area?: number,
 *   max_area?: number,
 *   bedrooms?: number,
 *   bathrooms?: number,
 *   district_id?: number,
 *   ward_id?: number,
 *   page?: number,
 *   limit?: number,
 *   sort_by?: 'price' | 'area' | 'created_at',
 *   sort_order?: 'asc' | 'desc'
 * }
 */
router.get('/', PropertyController.searchProperties);

/**
 * @route GET /api/v1/properties/stats
 * @desc Get property statistics
 * @access Public
 * @query {
 *   district_id?: number,
 *   property_type?: string
 * }
 */
router.get('/stats', PropertyController.getPropertyStats);

/**
 * @route GET /api/v1/properties/:id
 * @desc Get property by ID
 * @access Public
 * @param {string} id - Property ID
 */
router.get('/:id', PropertyController.getPropertyById);

/**
 * @route GET /api/v1/properties/:id/comparables
 * @desc Get comparable properties for a given property
 * @access Public
 * @param {string} id - Property ID
 * @query {
 *   limit?: number
 * }
 */
router.get('/:id/comparables', PropertyController.getComparableProperties);

export default router;