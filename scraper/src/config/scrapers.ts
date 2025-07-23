import { ScraperConfig, HeroConfig } from '../types';
import * as dotenv from 'dotenv';

dotenv.config();

export const heroConfig: HeroConfig = {
  stealthMode: process.env.HERO_STEALTH_MODE === 'true',
  blockAds: process.env.HERO_BLOCK_ADS === 'true',
  blockAnalytics: process.env.HERO_BLOCK_ANALYTICS === 'true',
  viewport: {
    width: 1920,
    height: 1080,
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

export const scraperConfigs: Record<string, ScraperConfig> = {
  batdongsan: {
    name: 'BatDongSan.com.vn',
    baseUrl: 'https://batdongsan.com.vn',
    delayMin: parseInt(process.env.SCRAPER_DELAY_MIN || '2000'),
    delayMax: parseInt(process.env.SCRAPER_DELAY_MAX || '5000'),
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '30000'),
    retries: parseInt(process.env.SCRAPER_RETRIES || '3'),
    maxPages: 10,
    maxProperties: 60,
  },
  nha: {
    name: 'Nha.com.vn',
    baseUrl: 'https://nha.com.vn',
    delayMin: parseInt(process.env.SCRAPER_DELAY_MIN || '2000'),
    delayMax: parseInt(process.env.SCRAPER_DELAY_MAX || '5000'),
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '30000'),
    retries: parseInt(process.env.SCRAPER_RETRIES || '3'),
    maxPages: 10,
    maxProperties: 60,
  },
  alonhadat: {
    name: 'Alonhadat.com.vn',
    baseUrl: 'https://alonhadat.com.vn',
    delayMin: parseInt(process.env.SCRAPER_DELAY_MIN || '2000'),
    delayMax: parseInt(process.env.SCRAPER_DELAY_MAX || '5000'),
    timeout: parseInt(process.env.SCRAPER_TIMEOUT || '30000'),
    retries: parseInt(process.env.SCRAPER_RETRIES || '3'),
    maxPages: 10,
    maxProperties: 60,
  },
};

export const globalConfig = {
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'scraper.log',
  maxConcurrentScrapers: 3,
  sessionTimeout: 300000, // 5 minutes
  retryDelay: 5000, // 5 seconds
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  ],
  viewports: [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 },
  ],
};

// Vietnamese provinces and major cities for geographic filtering
export const vietnameseProvinces = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Biên Hòa',
  'Vũng Tàu',
  'Nha Trang',
  'Huế',
  'Buôn Ma Thuột',
];

// Property types mapping for Vietnamese real estate
export const propertyTypeMapping: Record<string, string> = {
  'nhà riêng': 'Nhà riêng',
  'chung cư': 'Chung cư',
  'nhà mặt phố': 'Nhà mặt phố',
  'nhà mặt tiền': 'Nhà mặt tiền',
  'biệt thự': 'Biệt thự',
  'đất nền': 'Đất nền',
  'shophouse': 'Shophouse',
  'căn hộ': 'Căn hộ',
  'penthouse': 'Penthouse',
  'duplex': 'Duplex',
  'studio': 'Studio',
  'officetel': 'Officetel',
  'nhà phố': 'Nhà phố',
  'townhouse': 'Townhouse',
  'villa': 'Villa',
};

// Legal status mapping
export const legalStatusMapping: Record<string, string> = {
  'sổ đỏ': 'Sổ đỏ',
  'sổ hồng': 'Sổ hồng',
  'giấy tờ hợp lệ': 'Giấy tờ hợp lệ',
  'đang chờ sổ': 'Đang chờ sổ',
  'giấy phép xây dựng': 'Giấy phép xây dựng',
  'hợp đồng mua bán': 'Hợp đồng mua bán',
  'giấy ủy quyền': 'Giấy ủy quyền',
  'sổ chung': 'Sổ chung',
  'chưa có sổ': 'Chưa có sổ',
};