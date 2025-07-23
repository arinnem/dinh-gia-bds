import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { mockProperty, mockApiResponse } from '../../test/utils';
import {
  searchProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getSimilarProperties,
  getPropertyValuation,
  createPropertyValuation
} from '../propertyService';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Property Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('searchProperties', () => {
    it('searches properties with filters', async () => {
      const mockResponse = {
        properties: [mockProperty],
        total: 1,
        page: 1,
        limit: 10
      };
      
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(mockResponse));
      
      const filters = {
        query: 'District 1',
        property_type: 'apartment',
        min_price: 500000000,
        max_price: 2000000000,
        min_area: 50,
        max_area: 200,
        bedrooms: 3,
        bathrooms: 2,
        district: 'District 1',
        sort: 'price_asc',
        page: 1,
        limit: 10
      };
      
      const result = await searchProperties(filters);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/properties/search'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filters)
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    it('handles search with minimal filters', async () => {
      const mockResponse = { properties: [], total: 0, page: 1, limit: 10 };
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(mockResponse));
      
      const result = await searchProperties({});
      
      expect(result).toEqual(mockResponse);
    });

    it('handles search API errors', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(400, 'Bad Request'));
      
      await expect(searchProperties({})).rejects.toThrow('Bad Request');
    });
  });

  describe('getPropertyById', () => {
    it('fetches property by ID successfully', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(mockProperty));
      
      const result = await getPropertyById('1');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/properties/1');
      expect(result).toEqual(mockProperty);
    });

    it('handles property not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(404, 'Property not found'));
      
      await expect(getPropertyById('999')).rejects.toThrow('Property not found');
    });

    it('handles network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(getPropertyById('1')).rejects.toThrow('Network error');
    });
  });

  describe('createProperty', () => {
    it('creates property successfully', async () => {
      const newProperty = {
        title: 'New Property',
        location: 'New Location',
        price: 1000000000,
        area: 100,
        bedrooms: 3,
        bathrooms: 2,
        property_type: 'apartment',
        description: 'New property description'
      };
      
      mockFetch.mockResolvedValueOnce(mockApiResponse.success({ ...mockProperty, ...newProperty }));
      
      const result = await createProperty(newProperty);
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProperty)
        })
      );
      
      expect(result.title).toBe(newProperty.title);
    });

    it('handles validation errors', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(422, 'Validation error'));
      
      await expect(createProperty({})).rejects.toThrow('Validation error');
    });
  });

  describe('updateProperty', () => {
    it('updates property successfully', async () => {
      const updates = {
        title: 'Updated Property',
        price: 1200000000
      };
      
      const updatedProperty = { ...mockProperty, ...updates };
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(updatedProperty));
      
      const result = await updateProperty('1', updates);
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties/1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates)
        })
      );
      
      expect(result.title).toBe(updates.title);
      expect(result.price).toBe(updates.price);
    });

    it('handles update errors', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(404, 'Property not found'));
      
      await expect(updateProperty('999', {})).rejects.toThrow('Property not found');
    });
  });

  describe('deleteProperty', () => {
    it('deletes property successfully', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.success({ message: 'Property deleted' }));
      
      await deleteProperty('1');
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/properties/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });

    it('handles delete errors', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(404, 'Property not found'));
      
      await expect(deleteProperty('999')).rejects.toThrow('Property not found');
    });
  });

  describe('getFeaturedProperties', () => {
    it('fetches featured properties', async () => {
      const featuredProperties = [mockProperty];
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(featuredProperties));
      
      const result = await getFeaturedProperties();
      
      expect(mockFetch).toHaveBeenCalledWith('/api/properties/featured');
      expect(result).toEqual(featuredProperties);
    });

    it('handles empty featured properties', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.success([]));
      
      const result = await getFeaturedProperties();
      
      expect(result).toEqual([]);
    });
  });

  describe('getSimilarProperties', () => {
    it('fetches similar properties', async () => {
      const similarProperties = [mockProperty];
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(similarProperties));
      
      const result = await getSimilarProperties('1');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/properties/1/similar');
      expect(result).toEqual(similarProperties);
    });

    it('handles no similar properties found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.success([]));
      
      const result = await getSimilarProperties('1');
      
      expect(result).toEqual([]);
    });
  });

  describe('getPropertyValuation', () => {
    it('fetches property valuation', async () => {
      const mockValuation = {
        id: '1',
        property_id: '1',
        estimated_value: 1200000000,
        confidence_score: 0.85,
        valuation_date: '2024-01-01T00:00:00Z'
      };
      
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(mockValuation));
      
      const result = await getPropertyValuation('1');
      
      expect(mockFetch).toHaveBeenCalledWith('/api/properties/1/valuation');
      expect(result).toEqual(mockValuation);
    });

    it('handles valuation not found', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(404, 'Valuation not found'));
      
      await expect(getPropertyValuation('1')).rejects.toThrow('Valuation not found');
    });
  });

  describe('createPropertyValuation', () => {
    it('creates property valuation', async () => {
      const valuationData = {
        property_id: '1',
        methodology: 'Comparative Market Analysis',
        notes: 'Test valuation'
      };
      
      const mockValuation = {
        id: '1',
        ...valuationData,
        estimated_value: 1200000000,
        confidence_score: 0.85,
        valuation_date: '2024-01-01T00:00:00Z'
      };
      
      mockFetch.mockResolvedValueOnce(mockApiResponse.success(mockValuation));
      
      const result = await createPropertyValuation(valuationData);
      
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/valuations',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(valuationData)
        })
      );
      
      expect(result).toEqual(mockValuation);
    });

    it('handles valuation creation errors', async () => {
      mockFetch.mockResolvedValueOnce(mockApiResponse.error(422, 'Invalid property ID'));
      
      await expect(createPropertyValuation({})).rejects.toThrow('Invalid property ID');
    });
  });

  describe('API error handling', () => {
    it('handles JSON parsing errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      });
      
      await expect(getPropertyById('1')).rejects.toThrow('Invalid JSON');
    });

    it('handles non-JSON error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.reject(new Error('Not JSON'))
      });
      
      await expect(getPropertyById('1')).rejects.toThrow('Internal Server Error');
    });
  });
});