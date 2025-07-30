import { pool } from '../config/database';
import { District, Ward, City } from '../types';

export class LocationModel {
  // Cities
  static async getAllCities(): Promise<City[]> {
    try {
      const query = 'SELECT * FROM cities ORDER BY name';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting cities:', error);
      throw error;
    }
  }

  static async getCityById(id: number): Promise<City | null> {
    try {
      const query = 'SELECT * FROM cities WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting city by ID:', error);
      throw error;
    }
  }

  // Districts
  static async getAllDistricts(): Promise<District[]> {
    try {
      const query = `
        SELECT d.*, c.name as city_name
        FROM districts d
        LEFT JOIN cities c ON d.city_id = c.id
        ORDER BY c.name, d.name
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting districts:', error);
      throw error;
    }
  }

  static async getDistrictsByCity(cityId: number): Promise<District[]> {
    try {
      const query = `
        SELECT d.*, c.name as city_name
        FROM districts d
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE d.city_id = $1
        ORDER BY d.name
      `;
      const result = await pool.query(query, [cityId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting districts by city:', error);
      throw error;
    }
  }

  static async getDistrictById(id: number): Promise<District | null> {
    try {
      const query = `
        SELECT d.*, c.name as city_name
        FROM districts d
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE d.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting district by ID:', error);
      throw error;
    }
  }

  // Wards
  static async getAllWards(): Promise<Ward[]> {
    try {
      const query = `
        SELECT w.*, d.name as district_name, c.name as city_name
        FROM wards w
        LEFT JOIN districts d ON w.district_id = d.id
        LEFT JOIN cities c ON d.city_id = c.id
        ORDER BY c.name, d.name, w.name
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error getting wards:', error);
      throw error;
    }
  }

  static async getWardsByDistrict(districtId: number): Promise<Ward[]> {
    try {
      const query = `
        SELECT w.*, d.name as district_name, c.name as city_name
        FROM wards w
        LEFT JOIN districts d ON w.district_id = d.id
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE w.district_id = $1
        ORDER BY w.name
      `;
      const result = await pool.query(query, [districtId]);
      return result.rows;
    } catch (error) {
      console.error('Error getting wards by district:', error);
      throw error;
    }
  }

  static async getWardById(id: number): Promise<Ward | null> {
    try {
      const query = `
        SELECT w.*, d.name as district_name, c.name as city_name
        FROM wards w
        LEFT JOIN districts d ON w.district_id = d.id
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE w.id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting ward by ID:', error);
      throw error;
    }
  }

  // Search locations
  static async searchLocations(query: string): Promise<{
    cities: City[];
    districts: District[];
    wards: Ward[];
  }> {
    try {
      const searchTerm = `%${query}%`;

      // Search cities
      const citiesQuery = 'SELECT * FROM cities WHERE name ILIKE $1 ORDER BY name LIMIT 10';
      const citiesResult = await pool.query(citiesQuery, [searchTerm]);

      // Search districts
      const districtsQuery = `
        SELECT d.*, c.name as city_name
        FROM districts d
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE d.name ILIKE $1
        ORDER BY d.name
        LIMIT 10
      `;
      const districtsResult = await pool.query(districtsQuery, [searchTerm]);

      // Search wards
      const wardsQuery = `
        SELECT w.*, d.name as district_name, c.name as city_name
        FROM wards w
        LEFT JOIN districts d ON w.district_id = d.id
        LEFT JOIN cities c ON d.city_id = c.id
        WHERE w.name ILIKE $1
        ORDER BY w.name
        LIMIT 10
      `;
      const wardsResult = await pool.query(wardsQuery, [searchTerm]);

      return {
        cities: citiesResult.rows,
        districts: districtsResult.rows,
        wards: wardsResult.rows
      };
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  }

  // Get location hierarchy
  static async getLocationHierarchy(): Promise<{
    cities: (City & { districts: (District & { wards: Ward[] })[] })[];
  }> {
    try {
      const query = `
        SELECT 
          c.id as city_id, c.name as city_name,
          d.id as district_id, d.name as district_name,
          w.id as ward_id, w.name as ward_name
        FROM cities c
        LEFT JOIN districts d ON c.id = d.city_id
        LEFT JOIN wards w ON d.id = w.district_id
        ORDER BY c.name, d.name, w.name
      `;
      const result = await pool.query(query);

      const hierarchy: any = {};

      result.rows.forEach(row => {
        if (!hierarchy[row.city_id]) {
          hierarchy[row.city_id] = {
            id: row.city_id,
            name: row.city_name,
            districts: {}
          };
        }

        if (row.district_id && !hierarchy[row.city_id].districts[row.district_id]) {
          hierarchy[row.city_id].districts[row.district_id] = {
            id: row.district_id,
            name: row.district_name,
            city_id: row.city_id,
            wards: []
          };
        }

        if (row.ward_id) {
          hierarchy[row.city_id].districts[row.district_id].wards.push({
            id: row.ward_id,
            name: row.ward_name,
            district_id: row.district_id
          });
        }
      });

      // Convert to array format
      const cities = Object.values(hierarchy).map((city: any) => ({
        ...city,
        districts: Object.values(city.districts)
      }));

      return { cities };
    } catch (error) {
      console.error('Error getting location hierarchy:', error);
      throw error;
    }
  }
}