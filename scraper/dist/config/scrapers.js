"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalStatusMapping = exports.propertyTypeMapping = exports.vietnameseProvinces = exports.globalConfig = exports.scraperConfigs = exports.heroConfig = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.heroConfig = {
    stealthMode: process.env.HERO_STEALTH_MODE === 'true',
    blockAds: process.env.HERO_BLOCK_ADS === 'true',
    blockAnalytics: process.env.HERO_BLOCK_ANALYTICS === 'true',
    viewport: {
        width: 1920,
        height: 1080,
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};
exports.scraperConfigs = {
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
exports.globalConfig = {
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
exports.vietnameseProvinces = [
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
exports.propertyTypeMapping = {
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
exports.legalStatusMapping = {
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
//# sourceMappingURL=scrapers.js.map