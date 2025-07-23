import { PriceInfo, AddressInfo, PropertyFeatures } from '../types';

/**
 * Vietnamese text processing utilities for real estate data
 */
export class DataProcessor {
  /**
   * Parse Vietnamese price strings and convert to numeric value
   * Examples: "2,5 tỷ", "500 triệu", "15.000.000 VNĐ"
   */
  static parsePrice(priceText: string): PriceInfo {
    if (!priceText) {
      return { amount: 0, currency: 'VNĐ', formatted: priceText };
    }

    // Clean the price text
    let cleanPrice = priceText.toLowerCase().trim();
    cleanPrice = cleanPrice.replace(/[^\d.,tỷtriệuvnđ\s]/gi, '');

    let amount = 0;
    let multiplier = 1;

    // Handle billions (tỷ)
    if (cleanPrice.includes('tỷ')) {
      multiplier = 1000000000;
      cleanPrice = cleanPrice.replace('tỷ', '').trim();
    }
    // Handle millions (triệu)
    else if (cleanPrice.includes('triệu')) {
      multiplier = 1000000;
      cleanPrice = cleanPrice.replace('triệu', '').trim();
    }

    // Remove currency symbols
    cleanPrice = cleanPrice.replace(/vnđ|vnd|đ/gi, '').trim();

    // Handle Vietnamese decimal format (comma as decimal separator)
    if (cleanPrice.includes(',') && !cleanPrice.includes('.')) {
      // Format like "2,5" (2.5 billion)
      cleanPrice = cleanPrice.replace(',', '.');
    } else if (cleanPrice.includes('.') && cleanPrice.includes(',')) {
      // Format like "2.500.000,50" - remove dots, keep comma as decimal
      const parts = cleanPrice.split(',');
      if (parts.length === 2) {
        cleanPrice = parts[0].replace(/\./g, '') + '.' + parts[1];
      }
    } else if (cleanPrice.includes('.') && !cleanPrice.includes(',')) {
      // Check if it's thousands separator or decimal
      const dotCount = (cleanPrice.match(/\./g) || []).length;
      if (dotCount > 1) {
        // Multiple dots = thousands separators
        cleanPrice = cleanPrice.replace(/\./g, '');
      }
    }

    // Parse the numeric value
    const numericValue = parseFloat(cleanPrice);
    if (!isNaN(numericValue)) {
      amount = numericValue * multiplier;
    }

    return {
      amount,
      currency: 'VNĐ',
      formatted: priceText,
    };
  }

  /**
   * Parse area strings and convert to square meters
   * Examples: "120m2", "120 m²", "120 mét vuông"
   */
  static parseArea(areaText: string): number {
    if (!areaText) return 0;

    let cleanArea = areaText.toLowerCase().trim();
    cleanArea = cleanArea.replace(/[^\d.,]/g, '');

    // Handle Vietnamese decimal format
    if (cleanArea.includes(',') && !cleanArea.includes('.')) {
      cleanArea = cleanArea.replace(',', '.');
    }

    const numericValue = parseFloat(cleanArea);
    return isNaN(numericValue) ? 0 : numericValue;
  }

  /**
   * Parse Vietnamese address and extract components
   */
  static parseAddress(addressText: string): AddressInfo {
    if (!addressText) {
      return { full: '' };
    }

    const cleanAddress = addressText.trim();
    const parts = cleanAddress.split(',').map(part => part.trim());

    let ward, district, city;

    // Try to identify components based on Vietnamese address patterns
    for (const part of parts) {
      const lowerPart = part.toLowerCase();
      
      if (lowerPart.includes('phường') || lowerPart.includes('xã') || lowerPart.includes('thị trấn')) {
        ward = part;
      } else if (lowerPart.includes('quận') || lowerPart.includes('huyện') || lowerPart.includes('thành phố') || lowerPart.includes('thị xã')) {
        district = part;
      } else if (lowerPart.includes('tỉnh') || lowerPart.includes('thành phố')) {
        city = part;
      }
    }

    // If no specific identifiers found, use position-based parsing
    if (!ward && !district && !city && parts.length >= 3) {
      ward = parts[parts.length - 3];
      district = parts[parts.length - 2];
      city = parts[parts.length - 1];
    }

    return {
      full: cleanAddress,
      ward: ward?.replace(/^(phường|xã|thị trấn)\s*/i, ''),
      district: district?.replace(/^(quận|huyện|thành phố|thị xã)\s*/i, ''),
      city: city?.replace(/^(tỉnh|thành phố)\s*/i, ''),
    };
  }

  /**
   * Extract property features from description text
   */
  static extractFeatures(description: string): PropertyFeatures {
    if (!description) return {};

    const lowerDesc = description.toLowerCase();
    
    return {
      furnished: /nội thất|đầy đủ nội thất|có nội thất|full nội thất/.test(lowerDesc),
      parking: /chỗ đậu xe|bãi đậu xe|garage|hầm xe/.test(lowerDesc),
      elevator: /thang máy|thang bộ/.test(lowerDesc),
      balcony: /ban công|sân thượng/.test(lowerDesc),
      garden: /sân vườn|khu vườn|vườn/.test(lowerDesc),
      pool: /hồ bơi|bể bơi/.test(lowerDesc),
      security: /bảo vệ|an ninh|camera/.test(lowerDesc),
      gym: /phòng gym|thể dục|fitness/.test(lowerDesc),
    };
  }

  /**
   * Clean and normalize Vietnamese text
   */
  static cleanText(text: string): string {
    if (!text) return '';
    
    return text
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with space
      .replace(/\t+/g, ' ') // Replace tabs with space
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width characters
      .trim();
  }

  /**
   * Extract phone numbers from text
   */
  static extractPhoneNumbers(text: string): string[] {
    if (!text) return [];
    
    // Vietnamese phone number patterns
    const phonePatterns = [
      /(?:\+84|84|0)(?:3[2-9]|5[689]|7[06-9]|8[1-689]|9[0-46-9])\d{7}/g, // Mobile
      /(?:\+84|84|0)(?:2[0-9])\d{8}/g, // Landline
    ];
    
    const phones: string[] = [];
    
    for (const pattern of phonePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        phones.push(...matches);
      }
    }
    
    return [...new Set(phones)]; // Remove duplicates
  }

  /**
   * Validate and normalize property data
   */
  static validateProperty(property: any): boolean {
    // Required fields validation
    if (!property.title || !property.price || !property.area || !property.address) {
      return false;
    }

    // Price validation (should be reasonable for Vietnamese market)
    if (property.price < 100000 || property.price > 1000000000000) { // 100k to 1 trillion VND
      return false;
    }

    // Area validation (should be reasonable)
    if (property.area < 10 || property.area > 10000) { // 10 sqm to 10,000 sqm
      return false;
    }

    return true;
  }

  /**
   * Generate a unique hash for property deduplication
   */
  static generatePropertyHash(property: any): string {
    const hashString = `${property.title}-${property.address}-${property.price}-${property.area}`;
    return Buffer.from(hashString).toString('base64');
  }

  /**
   * Format price for display in Vietnamese format
   */
  static formatPrice(amount: number): string {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} tỷ VNĐ`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)} triệu VNĐ`;
    } else {
      return `${amount.toLocaleString('vi-VN')} VNĐ`;
    }
  }

  /**
   * Delay function for rate limiting
   */
  static async delay(min: number, max: number): Promise<void> {
    const delayTime = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }
}