import { PropertyModel } from '../models/Property';
import { LocationModel } from '../models/Location';
import { ValuationRequest, ValuationResponse, Property } from '../types';
import { pool } from '../config/database';

export class ValuationService {
  private static readonly SEARCH_RADIUS_KM = parseFloat(process.env.VALUATION_SEARCH_RADIUS_KM || '5');
  private static readonly MAX_COMPARABLES = parseInt(process.env.VALUATION_MAX_COMPARABLES || '10');

  /**
   * Main valuation method that estimates property value
   */
  static async estimateValue(request: ValuationRequest): Promise<ValuationResponse> {
    try {
      // Get comparable properties
      const comparables = await this.getComparableProperties(request);
      
      if (comparables.length === 0) {
        throw new Error('No comparable properties found for valuation');
      }

      // Calculate base value using comparable properties
      const baseValue = await this.calculateBaseValue(request, comparables);
      
      // Apply location adjustments
      const locationAdjustment = await this.calculateLocationAdjustment(request);
      
      // Apply property-specific adjustments
      const propertyAdjustment = this.calculatePropertyAdjustment(request, comparables);
      
      // Apply market trend adjustments
      const marketAdjustment = await this.calculateMarketAdjustment(request);
      
      // Calculate final estimated value
      const estimatedValue = Math.round(
        baseValue * 
        (1 + locationAdjustment) * 
        (1 + propertyAdjustment) * 
        (1 + marketAdjustment)
      );
      
      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(comparables, request);
      
      // Get market analysis
      const marketAnalysis = await this.getMarketAnalysis(request);
      
      // Get factor scores
      const factors = await this.calculateFactorScores(request);

      return {
        estimated_value: estimatedValue,
        confidence_score: confidenceScore,
        valuation_method: 'comparative_market_analysis',
        comparable_properties: comparables.slice(0, 5), // Return top 5 comparables
        market_analysis: marketAnalysis,
        factors
      };
    } catch (error) {
      console.error('Error in valuation service:', error);
      throw error;
    }
  }

  /**
   * Get comparable properties for valuation
   */
  private static async getComparableProperties(request: ValuationRequest): Promise<Property[]> {
    try {
      // First, try to find comparables in the same district
      let comparables = await PropertyModel.getComparableProperties(
        request.property_type,
        request.district_id,
        request.area,
        this.MAX_COMPARABLES
      );

      // If not enough comparables, expand search to nearby districts
      if (comparables.length < 3) {
        const nearbyComparables = await this.getNearbyComparables(request);
        comparables = [...comparables, ...nearbyComparables]
          .filter((prop, index, self) => 
            index === self.findIndex(p => p.id === prop.id)
          ) // Remove duplicates
          .slice(0, this.MAX_COMPARABLES);
      }

      return comparables;
    } catch (error) {
      console.error('Error getting comparable properties:', error);
      throw error;
    }
  }

  /**
   * Get comparable properties from nearby districts
   */
  private static async getNearbyComparables(request: ValuationRequest): Promise<Property[]> {
    try {
      const query = `
        SELECT p.*, d.name as district_name, w.name as ward_name
        FROM properties p
        LEFT JOIN districts d ON p.district_id = d.id
        LEFT JOIN wards w ON p.ward_id = w.id
        WHERE p.property_type = $1 
        AND p.district_id != $2
        AND p.area BETWEEN $3 * 0.6 AND $3 * 1.4
        AND p.price > 0
        ORDER BY ABS(p.area - $3), p.created_at DESC
        LIMIT $4
      `;
      const result = await pool.query(query, [
        request.property_type,
        request.district_id,
        request.area,
        this.MAX_COMPARABLES
      ]);
      return result.rows;
    } catch (error) {
      console.error('Error getting nearby comparables:', error);
      return [];
    }
  }

  /**
   * Calculate base value from comparable properties
   */
  private static async calculateBaseValue(request: ValuationRequest, comparables: Property[]): Promise<number> {
    if (comparables.length === 0) {
      throw new Error('No comparable properties available');
    }

    // Calculate price per square meter for each comparable
    const pricesPerSqm = comparables.map(prop => prop.price / prop.area);
    
    // Use weighted average based on similarity
    let totalWeight = 0;
    let weightedSum = 0;

    comparables.forEach((prop, index) => {
      const weight = this.calculateSimilarityWeight(request, prop);
      weightedSum += pricesPerSqm[index] * weight;
      totalWeight += weight;
    });

    const avgPricePerSqm = totalWeight > 0 ? weightedSum / totalWeight : pricesPerSqm.reduce((a, b) => a + b) / pricesPerSqm.length;
    
    return avgPricePerSqm * request.area;
  }

  /**
   * Calculate similarity weight between request and comparable property
   */
  private static calculateSimilarityWeight(request: ValuationRequest, comparable: Property): number {
    let weight = 1.0;

    // Area similarity (higher weight for closer area)
    const areaDiff = Math.abs(request.area - comparable.area) / request.area;
    weight *= Math.max(0.1, 1 - areaDiff);

    // Same district bonus
    if (request.district_id === comparable.district_id) {
      weight *= 1.5;
    }

    // Same ward bonus
    if (request.ward_id && request.ward_id === comparable.ward_id) {
      weight *= 1.3;
    }

    // Bedroom similarity
    if (request.bedrooms && comparable.bedrooms) {
      const bedroomDiff = Math.abs(request.bedrooms - comparable.bedrooms);
      weight *= Math.max(0.8, 1 - bedroomDiff * 0.1);
    }

    // Bathroom similarity
    if (request.bathrooms && comparable.bathrooms) {
      const bathroomDiff = Math.abs(request.bathrooms - comparable.bathrooms);
      weight *= Math.max(0.9, 1 - bathroomDiff * 0.05);
    }

    return weight;
  }

  /**
   * Calculate location-based adjustment
   */
  private static async calculateLocationAdjustment(request: ValuationRequest): Promise<number> {
    try {
      // Get district information
      const district = await LocationModel.getDistrictById(request.district_id);
      if (!district) return 0;

      // Simple location scoring based on district name patterns
      // In a real system, this would use more sophisticated location data
      const locationScore = this.getLocationScore(district.name);
      
      // Convert score to adjustment percentage (-20% to +20%)
      return (locationScore - 0.5) * 0.4;
    } catch (error) {
      console.error('Error calculating location adjustment:', error);
      return 0;
    }
  }

  /**
   * Get location score based on district characteristics
   */
  private static getLocationScore(districtName: string): number {
    const premiumDistricts = ['Quận 1', 'Quận 3', 'Quận 7', 'Quận Bình Thạnh', 'Thành phố Thủ Đức'];
    const goodDistricts = ['Quận 2', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 10', 'Quận 11'];
    
    if (premiumDistricts.some(d => districtName.includes(d))) {
      return 0.8;
    } else if (goodDistricts.some(d => districtName.includes(d))) {
      return 0.6;
    } else {
      return 0.4;
    }
  }

  /**
   * Calculate property-specific adjustments
   */
  private static calculatePropertyAdjustment(request: ValuationRequest, comparables: Property[]): number {
    let adjustment = 0;

    // Features bonus
    if (request.features && request.features.length > 0) {
      const avgFeatures = comparables.reduce((sum, prop) => 
        sum + (prop.features ? prop.features.length : 0), 0
      ) / comparables.length;
      
      const featureDiff = request.features.length - avgFeatures;
      adjustment += featureDiff * 0.02; // 2% per additional feature
    }

    return Math.max(-0.2, Math.min(0.2, adjustment)); // Cap at ±20%
  }

  /**
   * Calculate market trend adjustment
   */
  private static async calculateMarketAdjustment(request: ValuationRequest): Promise<number> {
    try {
      // Analyze recent price trends in the district
      const query = `
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          AVG(price / area) as avg_price_per_sqm
        FROM properties 
        WHERE district_id = $1 
        AND property_type = $2
        AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
      `;
      
      const result = await pool.query(query, [request.district_id, request.property_type]);
      
      if (result.rows.length < 2) {
        return 0; // Not enough data for trend analysis
      }

      // Calculate trend
      const prices = result.rows.map(row => parseFloat(row.avg_price_per_sqm));
      const firstPrice = prices[0];
      const lastPrice = prices[prices.length - 1];
      const trendPercentage = (lastPrice - firstPrice) / firstPrice;

      // Apply trend adjustment (max ±10%)
      return Math.max(-0.1, Math.min(0.1, trendPercentage * 0.5));
    } catch (error) {
      console.error('Error calculating market adjustment:', error);
      return 0;
    }
  }

  /**
   * Calculate confidence score
   */
  private static calculateConfidenceScore(comparables: Property[], request: ValuationRequest): number {
    let score = 0.5; // Base score

    // More comparables = higher confidence
    score += Math.min(0.3, comparables.length * 0.05);

    // Same district comparables boost confidence
    const sameDistrictCount = comparables.filter(p => p.district_id === request.district_id).length;
    score += sameDistrictCount * 0.03;

    // Recent data boosts confidence
    const recentCount = comparables.filter(p => {
      const daysDiff = (Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 90;
    }).length;
    score += recentCount * 0.02;

    return Math.max(0.1, Math.min(1.0, score));
  }

  /**
   * Get market analysis for the area
   */
  private static async getMarketAnalysis(request: ValuationRequest) {
    try {
      const query = `
        SELECT 
          AVG(price / area) as avg_price_per_sqm,
          COUNT(*) as total_properties,
          COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as recent_listings
        FROM properties 
        WHERE district_id = $1 
        AND property_type = $2
        AND price > 0
      `;
      
      const result = await pool.query(query, [request.district_id, request.property_type]);
      const data = result.rows[0];

      return {
        average_price_per_sqm: parseFloat(data.avg_price_per_sqm) || 0,
        market_trend: 'stable' as const, // Simplified for now
        supply_demand_ratio: parseFloat(data.recent_listings) / Math.max(1, parseFloat(data.total_properties))
      };
    } catch (error) {
      console.error('Error getting market analysis:', error);
      return {
        average_price_per_sqm: 0,
        market_trend: 'stable' as const,
        supply_demand_ratio: 0
      };
    }
  }

  /**
   * Calculate factor scores
   */
  private static async calculateFactorScores(request: ValuationRequest) {
    const locationScore = this.getLocationScore(
      (await LocationModel.getDistrictById(request.district_id))?.name || ''
    );

    return {
      location_score: locationScore,
      property_condition_score: 0.7, // Simplified - would need more property details
      market_activity_score: 0.6 // Simplified - would analyze market activity
    };
  }
}