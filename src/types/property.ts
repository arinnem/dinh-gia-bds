export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  description: string;
  imageUrl?: string;
  coordinates?: [number, number];
  amenities?: string[];
  yearBuilt?: number;
  condition?: string;
  parking?: number;
  floor?: number;
  totalFloors?: number;
  direction?: string;
  legalStatus?: string;
  pricePerSqm?: number;
  listingDate?: string;
  source?: 'database' | 'scraped';
}

export interface PropertySearchCriteria {
  location: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface PropertyFeatures {
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  frontage?: number;
  propertyType?: string;
  propertyTypeId: number;
  location?: string;
  districtId: number;
  amenities?: string[];
  condition?: string;
  parking?: boolean;
  yearBuilt?: number;
  buildingAge?: number;
  latitude?: number;
  longitude?: number;
  projectId?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasGarden?: boolean;
  hasPool?: boolean;
  hasSecurity?: boolean;
  floorLevel?: number;
  totalFloors?: number;
  nearMetro?: boolean;
  nearMall?: boolean;
  nearSchool?: boolean;
  nearHospital?: boolean;
  roadWidth?: number;
  hasGym?: boolean;
}

export interface MarketData {
  averagePrice: number;
  pricePerSqm: number;
  marketTrend: 'up' | 'down' | 'stable';
  transactionVolume: number;
  daysOnMarket: number;
  medianPrice?: number;
  totalProperties?: number;
  recentSales?: number;
  priceGrowth?: number;
}

export interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  pricePerSqm: number;
  bedrooms?: number;
  bathrooms?: number;
  distance: number;
  similarity: number;
  source: 'database' | 'scraped';
  imageUrl?: string;
  listingDate?: string;
  address?: string;
  soldDate?: Date;
}

export interface AVMResult {
  estimatedPrice: number;
  confidence: number;
  priceRange: {
    min: number;
    max: number;
  };
  pricePerSqm?: number;
  comparableProperties: ComparableProperty[];
  marketData: MarketData;
  factors?: {
    location: number;
    size: number;
    amenities: number;
    market: number;
    condition: number;
  };
  explanation?: string[];
  lastUpdated?: Date;
}

export interface ScrapedProperty {
  title: string;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  frontage?: number;
  fullAddress?: string;
  location?: {
    lat: number;
    lng: number;
  };
  additionalFeatures?: {
    thang_máy?: boolean;
    garage?: boolean;
    sân_vườn?: boolean;
    hồ_bơi?: boolean;
    an_ninh?: boolean;
    [key: string]: any;
  };
  images?: string[];
  description?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    name?: string;
  };
  source?: string;
  url?: string;
  scrapedAt?: Date;
}