// Database Models
export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  property_type: string;
  listing_type: 'sale' | 'rent';
  address: string;
  district_id: number;
  ward_id?: number;
  latitude?: number;
  longitude?: number;
  images?: string[];
  features?: string[];
  contact_info?: any;
  source_url?: string;
  source_website: string;
  scraped_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Ward {
  id: number;
  name: string;
  district_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface City {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Valuation {
  id: string;
  property_id: string;
  estimated_value: number;
  confidence_score: number;
  valuation_method: string;
  comparable_properties?: string[];
  market_factors?: any;
  created_at: Date;
  updated_at: Date;
}

// API Request/Response Types
export interface PropertySearchQuery {
  q?: string;
  property_type?: string;
  listing_type?: 'sale' | 'rent';
  min_price?: number;
  max_price?: number;
  min_area?: number;
  max_area?: number;
  bedrooms?: number;
  bathrooms?: number;
  district_id?: number;
  ward_id?: number;
  page?: number;
  limit?: number;
  sort_by?: 'price' | 'area' | 'created_at';
  sort_order?: 'asc' | 'desc';
}

export interface PropertySearchResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  filters: {
    applied: PropertySearchQuery;
    available: {
      property_types: string[];
      districts: District[];
      price_range: { min: number; max: number };
      area_range: { min: number; max: number };
    };
  };
}

export interface ValuationRequest {
  property_type: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  district_id: number;
  ward_id?: number;
  latitude?: number;
  longitude?: number;
  features?: string[];
}

export interface ValuationResponse {
  estimated_value: number;
  confidence_score: number;
  valuation_method: string;
  comparable_properties: Property[];
  market_analysis: {
    average_price_per_sqm: number;
    market_trend: 'increasing' | 'stable' | 'decreasing';
    supply_demand_ratio: number;
  };
  factors: {
    location_score: number;
    property_condition_score: number;
    market_activity_score: number;
  };
}

// API Response Wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Scraper Types
export interface ScraperStatus {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  last_run?: Date;
  properties_scraped?: number;
  error_message?: string;
}

export interface ScraperConfig {
  enabled: boolean;
  delay_min: number;
  delay_max: number;
  timeout: number;
  retries: number;
  properties_limit?: number;
}