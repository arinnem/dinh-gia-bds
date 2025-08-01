import { ScrapedProperty } from '../types';
export declare class PropertyService {
    private db;
    private pool;
    constructor();
    /**
     * Insert a scraped property into the database
     */
    insertProperty(scrapedProperty: ScrapedProperty): Promise<number | null>;
    /**
     * Get or create property type
     */
    private getOrCreatePropertyType;
    /**
     * Get or create legal status
     */
    private getOrCreateLegalStatus;
    /**
     * Get or create direction
     */
    private getOrCreateDirection;
    /**
     * Get district and ward IDs from address
     */
    private getLocationIds;
    /**
     * Get or create project
     */
    private getOrCreateProject;
    /**
     * Insert property images
     */
    private insertPropertyImages;
    /**
     * Insert price history
     */
    private insertPriceHistory;
    /**
     * Get property statistics
     */
    getPropertyStats(): Promise<any>;
    /**
     * Get properties by source site
     */
    getPropertiesBySource(sourceSite: string, limit?: number): Promise<any[]>;
}
//# sourceMappingURL=propertyService.d.ts.map