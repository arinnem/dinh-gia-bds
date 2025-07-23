import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Price formatting utilities
export const formatPrice = (price: number): string => {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k`;
  }
  return price.toLocaleString('vi-VN');
};

export const formatPriceRange = (min: number, max: number): string => {
  return `${formatPrice(min)} - ${formatPrice(max)}`;
};

export const formatPricePerM2 = (price: number, area: number): string => {
  const pricePerM2 = price / area;
  return `${formatPrice(pricePerM2)}/m²`;
};

// Area formatting
export const formatArea = (area: number): string => {
  return `${area.toLocaleString('vi-VN')} m²`;
};

// Date formatting
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ngày trước`;
  } else {
    return formatDate(date);
  }
};

// Property type utilities
export const getPropertyTypeText = (type: string): string => {
  const types: Record<string, string> = {
    apartment: 'Căn hộ',
    house: 'Nhà phố',
    villa: 'Biệt thự',
    land: 'Đất nền',
    office: 'Văn phòng',
    shop: 'Cửa hàng',
    warehouse: 'Kho xưởng',
  };
  return types[type] || type;
};

export const getPropertyTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    apartment: '🏢',
    house: '🏠',
    villa: '🏡',
    land: '🏞️',
    office: '🏢',
    shop: '🏪',
    warehouse: '🏭',
  };
  return icons[type] || '🏠';
};

// District and location utilities
export const getDistrictText = (district: string): string => {
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
    'binh-tan': 'Quận Bình Tân',
    'hoc-mon': 'Huyện Hóc Môn',
    'cu-chi': 'Huyện Củ Chi',
    'nha-be': 'Huyện Nhà Bè',
    'can-gio': 'Huyện Cần Giờ',
  };
  return districts[district.toLowerCase()] || district;
};

export const getCityText = (city: string): string => {
  const cities: Record<string, string> = {
    'ho-chi-minh': 'TP. Hồ Chí Minh',
    'ha-noi': 'Hà Nội',
    'da-nang': 'Đà Nẵng',
    'hai-phong': 'Hải Phòng',
    'can-tho': 'Cần Thơ',
    'bien-hoa': 'Biên Hòa',
    'hue': 'Huế',
    'nha-trang': 'Nha Trang',
    'buon-ma-thuot': 'Buôn Ma Thuột',
    'quy-nhon': 'Quy Nhon',
  };
  return cities[city.toLowerCase()] || city;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePrice = (price: string | number): boolean => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && numPrice > 0;
};

export const validateArea = (area: string | number): boolean => {
  const numArea = typeof area === 'string' ? parseFloat(area) : area;
  return !isNaN(numArea) && numArea > 0;
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(extension);
};

export const isDocumentFile = (filename: string): boolean => {
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
  const extension = getFileExtension(filename).toLowerCase();
  return docExtensions.includes(extension);
};

// URL utilities
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const getImageUrl = (path: string, size?: 'thumb' | 'medium' | 'large'): string => {
  if (!path) return '/placeholder-image.jpg';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  // If it's a Trae AI generated image, return as is
  if (path.includes('trae-api-sg.mchost.guru')) return path;
  
  const baseUrl = (typeof window !== 'undefined' && (window as any).__VITE_CDN_URL__) || '/api/v1/files';
  const sizeParam = size ? `?size=${size}` : '';
  
  return `${baseUrl}/${path}${sizeParam}`;
};

// Number utilities
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN');
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

// Array utilities
export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Color utilities
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    completed: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100',
    generating: 'text-blue-600 bg-blue-100',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100',
    info: 'text-blue-600 bg-blue-100',
  };
  return colors[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
};

export const getTrendColor = (value: number): string => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

// Search utilities
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
};

export const fuzzySearch = (items: any[], searchTerm: string, keys: string[]): any[] => {
  if (!searchTerm) return items;
  
  const searchLower = searchTerm.toLowerCase();
  
  return items.filter(item => {
    return keys.some(key => {
      const value = getNestedValue(item, key);
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Local storage utilities
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return defaultValue || null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Generate random ID
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Distance calculation (Haversine formula)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Format distance
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Constants
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Căn hộ' },
  { value: 'house', label: 'Nhà phố' },
  { value: 'villa', label: 'Biệt thự' },
  { value: 'land', label: 'Đất nền' },
  { value: 'office', label: 'Văn phòng' },
  { value: 'shop', label: 'Cửa hàng' },
  { value: 'warehouse', label: 'Kho xưởng' },
];

export const DISTRICTS_HCM = [
  { value: 'q1', label: 'Quận 1' },
  { value: 'q2', label: 'Quận 2' },
  { value: 'q3', label: 'Quận 3' },
  { value: 'q4', label: 'Quận 4' },
  { value: 'q5', label: 'Quận 5' },
  { value: 'q6', label: 'Quận 6' },
  { value: 'q7', label: 'Quận 7' },
  { value: 'q8', label: 'Quận 8' },
  { value: 'q9', label: 'Quận 9' },
  { value: 'q10', label: 'Quận 10' },
  { value: 'q11', label: 'Quận 11' },
  { value: 'q12', label: 'Quận 12' },
  { value: 'thu-duc', label: 'Thành phố Thủ Đức' },
  { value: 'binh-thanh', label: 'Quận Bình Thạnh' },
  { value: 'tan-binh', label: 'Quận Tân Bình' },
  { value: 'tan-phu', label: 'Quận Tân Phú' },
  { value: 'phu-nhuan', label: 'Quận Phú Nhuận' },
  { value: 'go-vap', label: 'Quận Gò Vấp' },
  { value: 'binh-tan', label: 'Quận Bình Tân' },
];

export const PRICE_RANGES = [
  { value: '0-1000000000', label: 'Dưới 1 tỷ' },
  { value: '1000000000-2000000000', label: '1 - 2 tỷ' },
  { value: '2000000000-3000000000', label: '2 - 3 tỷ' },
  { value: '3000000000-5000000000', label: '3 - 5 tỷ' },
  { value: '5000000000-10000000000', label: '5 - 10 tỷ' },
  { value: '10000000000-999999999999', label: 'Trên 10 tỷ' },
];

export const AREA_RANGES = [
  { value: '0-50', label: 'Dưới 50 m²' },
  { value: '50-100', label: '50 - 100 m²' },
  { value: '100-150', label: '100 - 150 m²' },
  { value: '150-200', label: '150 - 200 m²' },
  { value: '200-300', label: '200 - 300 m²' },
  { value: '300-999999', label: 'Trên 300 m²' },
];