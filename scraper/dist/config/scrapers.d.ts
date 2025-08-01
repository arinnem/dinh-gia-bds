import { ScraperConfig, HeroConfig } from '../types';
export declare const heroConfig: HeroConfig;
export declare const scraperConfigs: Record<string, ScraperConfig>;
export declare const globalConfig: {
    logLevel: string;
    logFile: string;
    maxConcurrentScrapers: number;
    sessionTimeout: number;
    retryDelay: number;
    userAgents: string[];
    viewports: {
        width: number;
        height: number;
    }[];
};
export declare const vietnameseProvinces: string[];
export declare const propertyTypeMapping: Record<string, string>;
export declare const legalStatusMapping: Record<string, string>;
//# sourceMappingURL=scrapers.d.ts.map