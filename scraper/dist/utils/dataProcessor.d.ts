import { PriceInfo, AddressInfo, PropertyFeatures } from '../types';
/**
 * Vietnamese text processing utilities for real estate data
 */
export declare class DataProcessor {
    /**
     * Parse Vietnamese price strings and convert to numeric value
     * Examples: "2,5 tỷ", "500 triệu", "15.000.000 VNĐ"
     */
    static parsePrice(priceText: string): PriceInfo;
    /**
     * Parse area strings and convert to square meters
     * Examples: "120m2", "120 m²", "120 mét vuông"
     */
    static parseArea(areaText: string): number;
    /**
     * Parse Vietnamese address and extract components
     */
    static parseAddress(addressText: string): AddressInfo;
    /**
     * Extract property features from description text
     */
    static extractFeatures(description: string): PropertyFeatures;
    /**
     * Clean and normalize Vietnamese text
     */
    static cleanText(text: string): string;
    /**
     * Extract phone numbers from text
     */
    static extractPhoneNumbers(text: string): string[];
    /**
     * Validate and normalize property data
     */
    static validateProperty(property: any): boolean;
    /**
     * Generate a unique hash for property deduplication
     */
    static generatePropertyHash(property: any): string;
    /**
     * Format price for display in Vietnamese format
     */
    static formatPrice(amount: number): string;
    /**
     * Delay function for rate limiting
     */
    static delay(min: number, max: number): Promise<void>;
}
//# sourceMappingURL=dataProcessor.d.ts.map