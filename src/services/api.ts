import { toast } from 'sonner';

// Types
export interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'villa' | 'land';
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  images: string[];
  description: string;
  yearBuilt?: number;
  direction?: string;
  legalStatus: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyValuation {
  id: string;
  propertyId: string;
  estimatedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  confidence: number;
  factors: {
    location: number;
    size: number;
    condition: number;
    market: number;
  };
  comparableProperties: Property[];
  marketTrends: {
    month: string;
    avgPrice: number;
    transactions: number;
  }[];
  createdAt: string;
}

export interface SearchFilters {
  query?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  district?: string;
  city?: string;
  sortBy?: 'price' | 'area' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchFilters;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'valuation' | 'market' | 'investment' | 'portfolio';
  status: 'completed' | 'generating' | 'failed';
  format: 'pdf' | 'excel' | 'word';
  downloadUrl?: string;
  createdAt: string;
  size?: string;
}

export interface MarketData {
  district: string;
  avgPrice: number;
  priceChange: number;
  transactions: number;
  inventory: number;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API');
      throw error;
    }
  }

  // Authentication
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ user: User; token: string }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me');
  }

  // Properties
  async searchProperties(filters: SearchFilters = {}): Promise<SearchResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    return this.request(`/properties/search?${params.toString()}`);
  }

  async getProperty(id: string): Promise<Property> {
    return this.request(`/properties/${id}`);
  }

  async createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getSimilarProperties(id: string, limit: number = 5): Promise<Property[]> {
    return this.request(`/properties/${id}/similar?limit=${limit}`);
  }

  // Property Valuation
  async getPropertyValuation(id: string): Promise<PropertyValuation> {
    return this.request(`/properties/${id}/valuation`);
  }

  async requestValuation(propertyData: {
    type: string;
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    address: string;
    district: string;
    city: string;
    yearBuilt?: number;
    direction?: string;
    amenities?: string[];
  }): Promise<PropertyValuation> {
    return this.request('/valuations', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
  }

  async getUserValuations(page: number = 1, limit: number = 10): Promise<{
    valuations: PropertyValuation[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/valuations?page=${page}&limit=${limit}`);
  }

  // Market Data
  async getMarketData(city?: string, district?: string): Promise<MarketData[]> {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (district) params.append('district', district);
    
    return this.request(`/market/data?${params.toString()}`);
  }

  async getMarketTrends(period: '1m' | '3m' | '6m' | '1y' = '6m'): Promise<{
    month: string;
    avgPrice: number;
    transactions: number;
    priceChange: number;
  }[]> {
    return this.request(`/market/trends?period=${period}`);
  }

  async getDistrictAnalysis(city: string): Promise<{
    district: string;
    avgPrice: number;
    priceChange: number;
    transactions: number;
    inventory: number;
    growth: number;
  }[]> {
    return this.request(`/market/districts?city=${city}`);
  }

  // Reports
  async getReports(page: number = 1, limit: number = 10): Promise<{
    reports: Report[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/reports?page=${page}&limit=${limit}`);
  }

  async generateReport(data: {
    type: 'valuation' | 'market' | 'investment' | 'portfolio';
    format: 'pdf' | 'excel' | 'word';
    propertyIds?: string[];
    filters?: any;
    template?: string;
  }): Promise<Report> {
    return this.request('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReport(id: string): Promise<Report> {
    return this.request(`/reports/${id}`);
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/reports/${id}/download`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    
    return response.blob();
  }

  async deleteReport(id: string): Promise<void> {
    return this.request(`/reports/${id}`, {
      method: 'DELETE',
    });
  }

  // File Upload
  async uploadFile(file: File, type: 'property' | 'document' = 'property'): Promise<{
    url: string;
    filename: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  async uploadMultipleFiles(files: File[], type: 'property' | 'document' = 'property'): Promise<{
    urls: string[];
    filenames: string[];
  }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('type', type);

    return this.request('/upload/multiple', {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  // Admin
  async getSystemStats(): Promise<{
    totalUsers: number;
    totalProperties: number;
    totalReports: number;
    totalValuations: number;
    monthlyGrowth: {
      users: number;
      properties: number;
      reports: number;
    };
  }> {
    return this.request('/admin/stats');
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.request(`/admin/users?page=${page}&limit=${limit}`);
  }

  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<User> {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  // Scraping
  async triggerScraping(sources: string[] = []): Promise<{
    jobId: string;
    status: string;
    estimatedTime: number;
  }> {
    return this.request('/scraping/trigger', {
      method: 'POST',
      body: JSON.stringify({ sources }),
    });
  }

  async getScrapingStatus(jobId: string): Promise<{
    jobId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    propertiesFound: number;
    errors: string[];
  }> {
    return this.request(`/scraping/status/${jobId}`);
  }
}

// Create and export API instance
export const api = new ApiService(API_BASE_URL);

// Export default
export default api;

// Utility functions
export const formatPrice = (price: number): string => {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k`;
  }
  return price.toString();
};

export const formatArea = (area: number): string => {
  return `${area} m²`;
};

export const getPropertyTypeText = (type: string): string => {
  const types: Record<string, string> = {
    apartment: 'Căn hộ',
    house: 'Nhà phố',
    villa: 'Biệt thự',
    land: 'Đất nền',
  };
  return types[type] || type;
};

export const getDistrictText = (district: string): string => {
  // Map common district codes to full names
  const districts: Record<string, string> = {
    'q1': 'Quận 1',
    'q2': 'Quận 2',
    'q3': 'Quận 3',
    'q4': 'Quận 4',
    'q5': 'Quận 5',
    'q6': 'Quận 6',
    'q7': 'Quận 7',
    'q8': 'Quận 8',
    'q9': 'Quận 9',
    'q10': 'Quận 10',
    'q11': 'Quận 11',
    'q12': 'Quận 12',
    'thu-duc': 'Thành phố Thủ Đức',
    'binh-thanh': 'Quận Bình Thạnh',
    'tan-binh': 'Quận Tân Bình',
    'tan-phu': 'Quận Tân Phú',
    'phu-nhuan': 'Quận Phú Nhuận',
    'go-vap': 'Quận Gò Vấp',
  };
  return districts[district.toLowerCase()] || district;
};