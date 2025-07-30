// Property data types for Vietnamese real estate scraping

export interface ScrapedProperty {
  title: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
    unit: string;
    negotiable?: boolean;
  };
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    } | null;
  };
  area: {
    total: number;
    usable?: number | null;
    unit: string;
  };
  propertyType: string;
  legalStatus?: string;
  direction?: string;
  features: {
    bedrooms?: number | null;
    bathrooms?: number | null;
    floors?: number | null;
    parking?: boolean;
    balcony?: boolean;
    garden?: boolean;
    elevator?: boolean;
    security?: boolean;
    furnished?: boolean;
  };
  images: string[];
  contact: {
    name?: string;
    phone?: string;
    email?: string | null;
  };
  url: string;
  source: string;
  scrapedAt: Date;
  hash: string;
  postedDate?: Date;
  projectName?: string;
  province_new?: string;
  ward_new?: string;
  street_new?: string;
}

export interface ScraperConfig {
  baseUrl: string;
  name: string;
  delayMin: number;
  delayMax: number;
  timeout: number;
  retries: number;
  maxPages?: number;
  maxProperties?: number;
}

export interface ScraperResult {
  success: boolean;
  propertiesScraped: number;
  errors: string[];
  duration: number;
  source: string;
}

export interface DatabaseProperty {
  id?: number;
  title: string;
  description?: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  district_id?: number;
  ward_id?: number;
  property_type_id: number;
  legal_status_id?: number;
  direction_id?: number;
  project_id?: number;
  location?: string; // PostGIS geometry
  source_url: string;
  source_site: string;
  contact_phone?: string;
  contact_name?: string;
  posted_date?: Date;
  created_at?: Date;
  updated_at?: Date;
  province_new?: string;
  ward_new?: string;
  street_new?: string;
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