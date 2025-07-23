import { PropertyFeatures, MarketData, AVMResult, ComparableProperty, ScrapedProperty } from '../types/property';

class AutomatedValuationModel {
  private districtMultipliers: Record<number, number> = {
    1: 2.5,   // Quận 1 - Premium
    2: 2.2,   // Quận 2 - High-end
    3: 2.0,   // Quận 3 - Central
    4: 1.5,   // Quận 4
    5: 1.4,   // Quận 5
    6: 1.3,   // Quận 6
    7: 1.8,   // Quận 7 - Phú Mỹ Hưng
    8: 1.2,   // Quận 8
    9: 1.4,   // Quận 9
    10: 1.6,  // Quận 10
    11: 1.3,  // Quận 11
    12: 1.2,  // Quận 12
    13: 1.7,  // Bình Thạnh
    14: 1.5,  // Gò Vấp
    15: 1.9,  // Phú Nhuận
    16: 1.6,  // Tân Bình
    17: 1.4,  // Tân Phú
    18: 1.1,  // Bình Chánh
    19: 0.8,  // Cần Giờ
    20: 1.0,  // Củ Chi
    21: 1.1,  // Hóc Môn
    22: 1.3,  // Nhà Bè
    23: 1.9   // Thủ Đức
  };

  private propertyTypeMultipliers: Record<number, number> = {
    1: 1.0,   // Căn hộ chung cư
    2: 1.2,   // Nhà riêng
    3: 1.8,   // Biệt thự
    4: 1.5,   // Shophouse
    5: 0.8,   // Đất nền
    6: 1.1,   // Nhà dự án
    7: 0.9,   // Nhà tập thể
    8: 1.0,   // Officetel
    9: 2.0,   // Penthouse
    10: 0.8,  // Studio
    11: 1.3,  // Duplex
    12: 1.4,  // Townhouse
    13: 1.9,  // Villa
    14: 1.1,  // Condotel
    15: 1.3,  // Nhà phố thương mại
    16: 1.0,  // Căn hộ dịch vụ
    17: 1.4,  // Nhà mặt tiền
    18: 1.0,  // Nhà hẻm
    19: 1.2,  // Căn hộ cao cấp
    20: 1.3   // Nhà liền kề
  };

  private basePricePerSqm = 50000000; // 50 million VND per sqm base price

  private locationMultipliers: Record<string, number> = {
    'Thủ Đức': 1.9,
    'Bình Thạnh': 1.7,
    'Phú Nhuận': 1.9,
    'Tân Bình': 1.6,
    'Gò Vấp': 1.5,
    'Quận 1': 2.5,
    'Quận 2': 2.2,
    'Quận 3': 2.0,
    'Quận 7': 1.8
  };



  private getSizeMultiplier(area: number): number {
    // Size multipliers based on area
    if (area < 50) return 0.8;
    if (area < 100) return 1.0;
    if (area < 200) return 1.1;
    if (area < 300) return 1.05;
    return 1.0;
  }

  private getAmenitiesMultiplier(amenities: string[]): number {
    const amenityValues: { [key: string]: number } = {
      'Hồ bơi': 0.05,
      'Gym': 0.03,
      'An ninh 24/7': 0.04,
      'Công viên': 0.03,
      'Thang máy': 0.02,
      'Chỗ đậu xe': 0.02,
      'Trường học': 0.03,
      'Siêu thị': 0.02
    };
    
    let multiplier = 1.0;
    amenities.forEach(amenity => {
      multiplier += amenityValues[amenity] || 0;
    });
    
    return Math.min(multiplier, 1.3);
  }

  private getConditionMultiplier(condition: string): number {
    const conditionValues: { [key: string]: number } = {
      'Mới': 1.1,
      'Tốt': 1.0,
      'Trung bình': 0.9,
      'Cần sửa chữa': 0.8
    };
    
    return conditionValues[condition] || 1.0;
  }

  private getPropertyTypeMultiplier(propertyType: string): number {
    const typeValues: { [key: string]: number } = {
      'Căn hộ': 1.0,
      'Nhà phố': 1.1,
      'Biệt thự': 1.2,
      'Chung cư': 0.95,
      'Đất nền': 0.8
    };
    
    return typeValues[propertyType] || 1.0;
  }

  private calculateLocationScore(features: PropertyFeatures): number {
    let score = 1.0;
    
    // District multiplier
    score *= this.districtMultipliers[features.districtId] || 1.0;
    
    // Proximity bonuses
    if (features.nearMetro) score *= 1.15;
    if (features.nearMall) score *= 1.08;
    if (features.nearSchool) score *= 1.05;
    if (features.nearHospital) score *= 1.03;
    
    // Road width bonus
    if (features.roadWidth) {
      if (features.roadWidth >= 20) score *= 1.2;
      else if (features.roadWidth >= 12) score *= 1.1;
      else if (features.roadWidth >= 8) score *= 1.05;
    }
    
    return Math.min(score, 3.0); // Cap at 3x
  }

  private calculateSizeScore(features: PropertyFeatures): number {
    let score = 1.0;
    
    // Area efficiency
    if (features.area <= 30) score *= 0.9;        // Very small penalty
    else if (features.area <= 50) score *= 0.95;  // Small penalty
    else if (features.area <= 80) score *= 1.0;   // Optimal size
    else if (features.area <= 120) score *= 1.05; // Large bonus
    else if (features.area <= 200) score *= 1.1;  // Very large bonus
    else score *= 1.15;                           // Luxury size bonus
    
    // Frontage bonus for land/houses
    if (features.frontage && features.propertyTypeId !== 1) { // Not apartment
      if (features.frontage >= 10) score *= 1.2;
      else if (features.frontage >= 6) score *= 1.1;
      else if (features.frontage >= 4) score *= 1.05;
    }
    
    return score;
  }

  private calculateAmenitiesScore(features: PropertyFeatures): number {
    let score = 1.0;
    
    if (features.hasElevator) score *= 1.08;
    if (features.hasParking) score *= 1.05;
    if (features.hasGarden) score *= 1.1;
    if (features.hasPool) score *= 1.15;
    if (features.hasGym) score *= 1.05;
    if (features.hasSecurity) score *= 1.08;
    
    // Floor level bonus for apartments
    if (features.propertyTypeId === 1 && features.floorLevel && features.totalFloors) {
      const floorRatio = features.floorLevel / features.totalFloors;
      if (floorRatio > 0.7) score *= 1.1;      // High floor bonus
      else if (floorRatio < 0.2) score *= 0.95; // Low floor penalty
    }
    
    return score;
  }

  private calculateConditionScore(features: PropertyFeatures): number {
    let score = 1.0;
    
    // Building age penalty
    if (features.buildingAge) {
      if (features.buildingAge <= 2) score *= 1.1;      // New building bonus
      else if (features.buildingAge <= 5) score *= 1.05; // Recent building
      else if (features.buildingAge <= 10) score *= 1.0; // Good condition
      else if (features.buildingAge <= 20) score *= 0.95; // Aging
      else score *= 0.85;                               // Old building
    }
    
    return score;
  }

  private async getMarketData(districtIdOrLocation: number | string): Promise<MarketData> {
    // In a real implementation, this would query the database for market data
    // For now, we'll simulate market data
    
    let multiplier = 1.0;
    if (typeof districtIdOrLocation === 'number') {
      multiplier = this.districtMultipliers[districtIdOrLocation] || 1.0;
    } else {
      multiplier = this.locationMultipliers[districtIdOrLocation] || 1.0;
    }
    
    const basePrice = this.basePricePerSqm * multiplier;
    
    return {
      averagePrice: basePrice * 100, // Assume 100 sqm average
      medianPrice: basePrice * 100 * 0.95,
      pricePerSqm: basePrice,
      totalProperties: Math.floor(Math.random() * 500) + 100,
      recentSales: Math.floor(Math.random() * 50) + 10,
      priceGrowth: (Math.random() - 0.5) * 0.2, // -10% to +10%
      marketTrend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down',
      transactionVolume: Math.floor(Math.random() * 100) + 20,
      daysOnMarket: Math.floor(Math.random() * 60) + 15
    };
  }

  private async findComparableProperties(features: PropertyFeatures): Promise<ComparableProperty[]> {
    // In a real implementation, this would query the database for similar properties
    // For now, we'll simulate comparable properties
    
    const comparables: ComparableProperty[] = [];
    const multiplier = this.districtMultipliers[features.districtId] || 1.0;
    const basePrice = this.basePricePerSqm * multiplier;
    
    for (let i = 0; i < 5; i++) {
      const areaVariation = 0.8 + Math.random() * 0.4; // 80% to 120% of target area
      const priceVariation = 0.9 + Math.random() * 0.2; // 90% to 110% of base price
      const area = features.area * areaVariation;
      const pricePerSqm = basePrice * priceVariation;
      
      comparables.push({
        id: `comp_${i + 1}`,
        title: `Căn hộ tương tự ${i + 1}`,
        location: `Khu vực tương tự ${i + 1}`,
        price: area * pricePerSqm,
        area: Math.round(area),
        pricePerSqm: Math.round(pricePerSqm),
        similarity: 0.8 + Math.random() * 0.2, // 80% to 100% similarity
        distance: Math.random() * 2, // 0 to 2 km
        source: 'database' as const,
        address: `Địa chỉ tương tự ${i + 1}`,
        bedrooms: features.bedrooms,
        bathrooms: features.bathrooms,
        soldDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
      });
    }
    
    return comparables.sort((a, b) => b.similarity - a.similarity);
  }

  async calculatePropertyValue(features: PropertyFeatures): Promise<AVMResult> {
    // Calculate individual factor scores
    const locationScore = this.calculateLocationScore(features);
    const sizeScore = this.calculateSizeScore(features);
    const amenitiesScore = this.calculateAmenitiesScore(features);
    const conditionScore = this.calculateConditionScore(features);
    const propertyTypeMultiplier = this.propertyTypeMultipliers[features.propertyTypeId] || 1.0;
    
    // Calculate base price
    const basePricePerSqm = this.basePricePerSqm * this.districtMultipliers[features.districtId];
    
    // Apply all multipliers
    const adjustedPricePerSqm = basePricePerSqm * 
      locationScore * 
      sizeScore * 
      amenitiesScore * 
      conditionScore * 
      propertyTypeMultiplier;
    
    const estimatedPrice = adjustedPricePerSqm * features.area;
    
    // Calculate confidence based on data availability
    let confidence = 0.7; // Base confidence
    if (features.latitude && features.longitude) confidence += 0.1;
    if (features.bedrooms && features.bathrooms) confidence += 0.1;
    if (features.projectId) confidence += 0.05;
    if (features.buildingAge !== undefined) confidence += 0.05;
    
    // Get market data and comparables
    const marketData = await this.getMarketData(features.districtId);
    const comparableProperties = await this.findComparableProperties(features);
    
    // Adjust estimate based on market trend
    let marketAdjustedPrice = estimatedPrice;
    if (marketData.marketTrend === 'up') {
      marketAdjustedPrice *= 1.05;
    } else if (marketData.marketTrend === 'down') {
      marketAdjustedPrice *= 0.95;
    }
    
    // Calculate price range (confidence interval)
    const priceRange = {
      min: Math.round(marketAdjustedPrice * (1 - (1 - confidence) * 0.3)),
      max: Math.round(marketAdjustedPrice * (1 + (1 - confidence) * 0.3))
    };
    
    // Generate explanation
    const explanation = [
      `Giá cơ sở: ${Math.round(basePricePerSqm).toLocaleString('vi-VN')} VNĐ/m²`,
      `Hệ số vị trí: ${locationScore.toFixed(2)}x`,
      `Hệ số diện tích: ${sizeScore.toFixed(2)}x`,
      `Hệ số tiện ích: ${amenitiesScore.toFixed(2)}x`,
      `Hệ số tình trạng: ${conditionScore.toFixed(2)}x`,
      `Hệ số loại hình: ${propertyTypeMultiplier.toFixed(2)}x`,
      `Xu hướng thị trường: ${marketData.marketTrend === 'up' ? 'Tăng' : marketData.marketTrend === 'down' ? 'Giảm' : 'Ổn định'}`
    ];
    
    return {
      estimatedPrice: Math.round(marketAdjustedPrice),
      confidence: Math.round(confidence * 100) / 100,
      priceRange,
      pricePerSqm: Math.round(adjustedPricePerSqm),
      marketData,
      comparableProperties,
      factors: {
        location: Math.round(locationScore * 100) / 100,
        size: Math.round(sizeScore * 100) / 100,
        amenities: Math.round(amenitiesScore * 100) / 100,
        market: marketData.marketTrend === 'up' ? 1.05 : marketData.marketTrend === 'down' ? 0.95 : 1.0,
        condition: Math.round(conditionScore * 100) / 100
      },
      explanation
    };
  }

  async estimateFromScrapedData(scrapedProperty: ScrapedProperty): Promise<AVMResult | null> {
    if (!scrapedProperty.area) {
      console.warn('Cannot estimate value without area information');
      return null;
    }

    // Convert scraped data to features
    const features: PropertyFeatures = {
      area: scrapedProperty.area,
      bedrooms: scrapedProperty.bedrooms,
      bathrooms: scrapedProperty.bathrooms,
      floors: scrapedProperty.floors,
      frontage: scrapedProperty.frontage,
      districtId: this.guessDistrictFromAddress(scrapedProperty.fullAddress || ''),
      propertyTypeId: this.guessPropertyTypeFromTitle(scrapedProperty.title),
      latitude: scrapedProperty.location?.lat,
      longitude: scrapedProperty.location?.lng,
      // Extract amenities from additional features
      hasElevator: scrapedProperty.additionalFeatures?.thang_máy || false,
      hasParking: scrapedProperty.additionalFeatures?.garage || false,
      hasGarden: scrapedProperty.additionalFeatures?.sân_vườn || false,
      hasPool: scrapedProperty.additionalFeatures?.hồ_bơi || false,
      hasSecurity: scrapedProperty.additionalFeatures?.an_ninh || false
    };

    return this.calculatePropertyValue(features);
  }

  private guessDistrictFromAddress(address: string): number {
    const districtMap: Record<string, number> = {
      'quận 1': 1, 'q1': 1, 'q.1': 1,
      'quận 2': 2, 'q2': 2, 'q.2': 2, 'thủ đức': 23,
      'quận 3': 3, 'q3': 3, 'q.3': 3,
      'quận 4': 4, 'q4': 4, 'q.4': 4,
      'quận 5': 5, 'q5': 5, 'q.5': 5,
      'quận 6': 6, 'q6': 6, 'q.6': 6,
      'quận 7': 7, 'q7': 7, 'q.7': 7,
      'quận 8': 8, 'q8': 8, 'q.8': 8,
      'quận 9': 9, 'q9': 9, 'q.9': 9,
      'quận 10': 10, 'q10': 10, 'q.10': 10,
      'quận 11': 11, 'q11': 11, 'q.11': 11,
      'quận 12': 12, 'q12': 12, 'q.12': 12,
      'bình thạnh': 13, 'binh thanh': 13,
      'gò vấp': 14, 'go vap': 14,
      'phú nhuận': 15, 'phu nhuan': 15,
      'tân bình': 16, 'tan binh': 16,
      'tân phú': 17, 'tan phu': 17
    };

    const lowerAddress = address.toLowerCase();
    for (const [key, value] of Object.entries(districtMap)) {
      if (lowerAddress.includes(key)) {
        return value;
      }
    }
    
    return 1; // Default to District 1
  }

  private guessPropertyTypeFromTitle(title: string): number {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('biệt thự') || lowerTitle.includes('villa')) return 3;
    if (lowerTitle.includes('shophouse')) return 4;
    if (lowerTitle.includes('đất nền') || lowerTitle.includes('đất')) return 5;
    if (lowerTitle.includes('penthouse')) return 9;
    if (lowerTitle.includes('studio')) return 10;
    if (lowerTitle.includes('duplex')) return 11;
    if (lowerTitle.includes('townhouse')) return 12;
    if (lowerTitle.includes('officetel')) return 8;
    if (lowerTitle.includes('nhà phố') || lowerTitle.includes('nhà riêng')) return 2;
    
    return 1; // Default to apartment
  }
}

export const avmService = new AutomatedValuationModel();
export { AutomatedValuationModel };
export type { PropertyFeatures, AVMResult, ComparableProperty, MarketData };