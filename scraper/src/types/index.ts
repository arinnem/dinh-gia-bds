// Property data types for Vietnamese real estate scraping

export interface ScrapedProperty {
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    unit: string;
    negotiable?: boolean;
  };
  area: {
    total: number;
    unit: string;
  };
  features: {
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
  };
  address: {
    full: string;
    province: string;
    ward: string;
    district: string;
    coordinates: {
      lat: number | null;
      lng: number | null;
    };
  };
  propertyType: string;
  legalStatus: string;
  direction: string;
  projectName: string;
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  url: string;
  source: string;
  scrapedAt: string;
  postedDate?: string;
  hash: string;
  // Address normalization fields
  province_new?: string;
  ward_new?: string;
  street_new?: string;
  province_id?: number | null;
  district_id?: number | null;
  ward_id?: number | null;
  // NEW: Address conversion fields
  is_converted?: boolean;
  original_address?: string;
  converted_address?: string;
  conversion_error?: string;
}

export interface ScraperConfig {
  maxProperties: number;
  maxPages: number;
  debug: boolean;
  startUrls: string[];
}

export interface ScrapingResult {
  success: boolean;
  propertiesScraped: number;
  errors: string[];
  duration: number;
  source: string;
}

export interface DatabaseProperty {
  id: string;
  source_url: string;
  source_site: string;
  title: string;
  description: string;
  price: number;
  price_per_sqm: number | null;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  frontage: number | null;
  full_address: string;
  location: any;
  additional_features: any;
  avm_estimate: number | null;
  published_at: Date | null;
  last_scraped_at: Date;
  project_id: string | null;
  property_type_id: number;
  legal_status_id: number | null;
  direction_id: number | null;
  ward_id: number | null;
  district_id: number | null;
  province_new: string | null;
  ward_new: string | null;
  street_new: string | null;
  // NEW: Address conversion fields
  is_address_converted: boolean;
  original_address: string | null;
  converted_address: string | null;
  conversion_error: string | null;
  address_conversion_date: Date | null;
}

export interface ScrapingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  totalProperties: number;
  totalPropertiesScraped: number;
  successfulProperties: number;
  failedProperties: number;
  totalErrors: number;
  sources: string[];
  scraperResults: any[];
  status: 'running' | 'completed' | 'failed' | 'cancelled';
}

export interface HeroConfig {
  stealthMode: boolean;
  blockAds: boolean;
  blockAnalytics: boolean;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  proxy?: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  };
}

export interface PriceInfo {
  amount: number;
  currency: string;
  unit?: string; // per sqm, total, etc.
  formatted: string;
}

export interface AddressInfo {
  full: string;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyImage {
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
}

export interface ContactInfo {
  name?: string;
  phone?: string;
  email?: string;
  agency?: string;
}

export interface PropertyFeatures {
  furnished?: boolean;
  parking?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  garden?: boolean;
  pool?: boolean;
  security?: boolean;
  gym?: boolean;
  [key: string]: boolean | undefined;
}

export interface ScrapingError {
  url: string;
  error: string;
  timestamp: Date;
  retryCount: number;
  source: string;
}