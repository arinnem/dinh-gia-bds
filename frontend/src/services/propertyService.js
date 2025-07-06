import apiClient from './apiClient';

const API_ENDPOINT = '/properties'; // Base endpoint for properties

/**
 * Fetches a paginated list of properties with optional filters.
 * @param {object} params - Query parameters for pagination and filtering.
 * @param {number} params.skip - Number of records to skip.
 *   @param {number} params.limit - Maximum number of records to return.
 * @param {string} [params.address_full] - Filter by full address.
 * @param {string} [params.address_city] - Filter by city.
 * @param {string} [params.address_district] - Filter by district.
 * @param {string} [params.property_type] - Filter by property type.
 * @param {number} [params.min_land_area_sqm]
 * @param {number} [params.max_land_area_sqm]
 * @param {number} [params.min_listing_price]
 * @param {number} [params.max_listing_price]
 * @param {string} [params.data_source_listing]
 * @returns {Promise<object>} The paginated list of properties.
 *                            Example: { limit, offset, total, items: [...] }
 */
export const getProperties = async (params = { skip: 0, limit: 10 }) => {
    try {
        const response = await apiClient.get(API_ENDPOINT, { params });
        return response.data; // Assuming backend returns data in the format { limit, offset, total, items }
    } catch (error) {
        console.error('Error fetching properties:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches a single property by its ID.
 * @param {number|string} propertyId - The ID of the property.
 * @returns {Promise<object>} The property data.
 */
export const getPropertyById = async (propertyId) => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT}/${propertyId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching property with ID ${propertyId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Creates a new property.
 * @param {object} propertyData - The data for the new property (matching PropertyCreate schema).
 * @returns {Promise<object>} The created property data.
 */
export const createProperty = async (propertyData) => {
    try {
        const response = await apiClient.post(API_ENDPOINT, propertyData);
        return response.data;
    } catch (error) {
        console.error('Error creating property:', error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Updates an existing property.
 * @param {number|string} propertyId - The ID of the property to update.
 * @param {object} propertyUpdateData - The data to update (matching PropertyUpdate schema).
 * @returns {Promise<object>} The updated property data.
 */
export const updateProperty = async (propertyId, propertyUpdateData) => {
    try {
        const response = await apiClient.put(`${API_ENDPOINT}/${propertyId}`, propertyUpdateData);
        return response.data;
    } catch (error) {
        console.error(`Error updating property with ID ${propertyId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Deletes a property by its ID.
 * @param {number|string} propertyId - The ID of the property to delete.
 * @returns {Promise<void>}
 */
export const deleteProperty = async (propertyId) => {
    try {
        await apiClient.delete(`${API_ENDPOINT}/${propertyId}`);
    } catch (error) {
        console.error(`Error deleting property with ID ${propertyId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Fetches suggested comparable sales for a given property.
 * @param {number|string} propertyId - The ID of the subject property.
 * @param {object} params - Query parameters for suggestion criteria.
 * @param {number} [params.max_distance_km]
 * @param {number} [params.date_window_months]
 * @param {number} [params.area_tolerance_percent]
 * @param {number} [params.max_results]
 * @returns {Promise<Array<object>>} A list of suggested comparable sales (HistoricalSalePublic schema).
 */
export const getSuggestedComps = async (propertyId, params = {}) => {
    try {
        const response = await apiClient.get(`${API_ENDPOINT}/${propertyId}/suggest_comps`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching suggested comps for property ID ${propertyId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
```
