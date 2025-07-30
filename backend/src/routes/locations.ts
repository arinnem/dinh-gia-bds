import { Router } from 'express';
import { LocationController } from '../controllers/LocationController';
import { rateLimiter } from '../middleware';

const router = Router();

// Apply rate limiting to all location routes
router.use(rateLimiter);

/**
 * @route GET /api/v1/locations/cities
 * @desc Get all cities
 * @access Public
 * @returns City[]
 */
router.get('/cities', LocationController.getCities);

/**
 * @route GET /api/v1/locations/cities/:id
 * @desc Get city by ID
 * @access Public
 * @param {number} id - City ID
 * @returns City
 */
router.get('/cities/:id', LocationController.getCityById);

/**
 * @route GET /api/v1/locations/districts
 * @desc Get all districts or districts by city
 * @access Public
 * @query {
 *   city_id?: number
 * }
 * @returns District[]
 */
router.get('/districts', LocationController.getDistricts);

/**
 * @route GET /api/v1/locations/districts/:id
 * @desc Get district by ID
 * @access Public
 * @param {number} id - District ID
 * @returns District
 */
router.get('/districts/:id', LocationController.getDistrictById);

/**
 * @route GET /api/v1/locations/wards
 * @desc Get all wards or wards by district
 * @access Public
 * @query {
 *   district_id?: number
 * }
 * @returns Ward[]
 */
router.get('/wards', LocationController.getWards);

/**
 * @route GET /api/v1/locations/wards/:id
 * @desc Get ward by ID
 * @access Public
 * @param {number} id - Ward ID
 * @returns Ward
 */
router.get('/wards/:id', LocationController.getWardById);

/**
 * @route GET /api/v1/locations/search
 * @desc Search locations by name
 * @access Public
 * @query {
 *   q: string
 * }
 * @returns {
 *   cities: City[],
 *   districts: District[],
 *   wards: Ward[]
 * }
 */
router.get('/search', LocationController.searchLocations);

/**
 * @route GET /api/v1/locations/hierarchy
 * @desc Get complete location hierarchy
 * @access Public
 * @returns {
 *   cities: (City & { districts: (District & { wards: Ward[] })[] })[]