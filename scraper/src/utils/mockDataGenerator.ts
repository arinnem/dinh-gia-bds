import { ScrapedProperty } from '../types';
import { DataProcessor } from './dataProcessor';

export class MockDataGenerator {
  private static readonly PROPERTY_TYPES = [
    'Nhà riêng', 'Chung cư', 'Nhà mặt phố', 'Biệt thự', 'Đất nền', 'Shophouse', 'Căn hộ'
  ];

  private static readonly DISTRICTS = [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Quận 9', 'Quận 10',
    'Quận Bình Thạnh', 'Quận Tân Bình', 'Quận Phú Nhuận', 'Quận Gò Vấp'
  ];

  private static readonly WARDS = [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6',
    'Phường Bến Nghé', 'Phường Đa Kao', 'Phường Cô Giang', 'Phường Nguyễn Cư Trinh'
  ];

  private static readonly DIRECTIONS = [
    'Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'
  ];

  private static readonly LEGAL_STATUSES = [
    'Sổ đỏ', 'Sổ hồng', 'Giấy tờ hợp lệ', 'Đang chờ sổ'
  ];

  private static readonly SOURCES = [
    'BatDongSan.com.vn', 'Nha.com.vn', 'Alonhadat.com.vn'
  ];

  private static readonly SAMPLE_DESCRIPTIONS = [
    'Nhà đẹp, vị trí thuận lợi, gần trường học và bệnh viện',
    'Căn hộ cao cấp, view đẹp, đầy đủ nội thất',
    'Biệt thự sang trọng, sân vườn rộng rãi',
    'Nhà mặt phố kinh doanh tốt, vị trí đắc địa',
    'Đất nền dự án, pháp lý rõ ràng, giá đầu tư'
  ];

  public static generateMockProperty(source: string, index: number): ScrapedProperty {
    const propertyType = this.getRandomItem(this.PROPERTY_TYPES);
    const district = this.getRandomItem(this.DISTRICTS);
    const ward = this.getRandomItem(this.WARDS);
    const direction = this.getRandomItem(this.DIRECTIONS);
    const legalStatus = this.getRandomItem(this.LEGAL_STATUSES);
    const description = this.getRandomItem(this.SAMPLE_DESCRIPTIONS);

    // Generate realistic coordinates for Ho Chi Minh City
    const latitude = 10.7 + (Math.random() * 0.3); // 10.7 to 11.0
    const longitude = 106.6 + (Math.random() * 0.4); // 106.6 to 107.0

    // Generate realistic prices based on property type
    const basePrice = this.getBasePriceByType(propertyType);
    const price = basePrice + (Math.random() * basePrice * 0.5); // ±50% variation

    // Generate realistic areas
    const totalArea = this.getAreaByType(propertyType);
    const usableArea = totalArea * (0.7 + Math.random() * 0.2); // 70-90% of total

    const property: ScrapedProperty = {
      title: `${propertyType} ${district} - ${ward}`,
      price: {
        amount: Math.round(price),
        currency: 'VND',
        unit: propertyType === 'Đất nền' ? 'per_sqm' : 'total'
      },
      area: {
        total: Math.round(totalArea),
        usable: Math.round(usableArea),
        unit: 'sqm'
      },
      address: {
        full: `${ward}, ${district}, Thành phố Hồ Chí Minh`,
        district: district,
        ward: ward,
        city: 'Thành phố Hồ Chí Minh',
        coordinates: {
          lat: parseFloat(latitude.toFixed(6)),
          lng: parseFloat(longitude.toFixed(6))
        }
      },
      propertyType: propertyType,
      description: description,
      features: {
        bedrooms: this.getBedroomsByType(propertyType),
        bathrooms: Math.floor(Math.random() * 3) + 1,
        floors: Math.floor(Math.random() * 4) + 1
      },
      contact: {
        name: this.generateRandomName(),
        phone: this.generateRandomPhone()
      },
      images: this.generateImageUrls(3 + Math.floor(Math.random() * 5)),
      url: `https://${source.toLowerCase().replace('.com.vn', '.com.vn')}/property-${index}`,
      source: source,
      direction: direction,
      legalStatus: legalStatus,
      scrapedAt: new Date(),
      hash: `mock-${source}-${index}-${Date.now()}`
    };

    return property;
  }

  public static generateMockProperties(source: string, count: number): ScrapedProperty[] {
    const properties: ScrapedProperty[] = [];
    
    for (let i = 1; i <= count; i++) {
      properties.push(this.generateMockProperty(source, i));
    }
    
    return properties;
  }

  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getBasePriceByType(propertyType: string): number {
    const priceMap: Record<string, number> = {
      'Nhà riêng': 3000000000, // 3 billion VND
      'Chung cư': 2000000000,  // 2 billion VND
      'Nhà mặt phố': 8000000000, // 8 billion VND
      'Biệt thự': 15000000000, // 15 billion VND
      'Đất nền': 50000000,     // 50 million VND per sqm
      'Shophouse': 5000000000, // 5 billion VND
      'Căn hộ': 1500000000     // 1.5 billion VND
    };
    
    return priceMap[propertyType] || 2000000000;
  }

  private static getAreaByType(propertyType: string): number {
    const areaMap: Record<string, [number, number]> = {
      'Nhà riêng': [60, 150],
      'Chung cư': [50, 120],
      'Nhà mặt phố': [80, 200],
      'Biệt thự': [200, 500],
      'Đất nền': [100, 300],
      'Shophouse': [80, 180],
      'Căn hộ': [40, 100]
    };
    
    const [min, max] = areaMap[propertyType] || [60, 150];
    return min + Math.random() * (max - min);
  }

  private static getBedroomsByType(propertyType: string): number {
    const bedroomMap: Record<string, [number, number]> = {
      'Nhà riêng': [2, 4],
      'Chung cư': [1, 3],
      'Nhà mặt phố': [3, 5],
      'Biệt thự': [4, 6],
      'Đất nền': [0, 0],
      'Shophouse': [2, 4],
      'Căn hộ': [1, 3]
    };
    
    const [min, max] = bedroomMap[propertyType] || [2, 3];
    if (min === 0 && max === 0) return 0;
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  private static generateRandomName(): string {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ'];
    const lastNames = ['Văn Anh', 'Thị Lan', 'Minh Tuấn', 'Thị Hoa', 'Văn Nam', 'Thị Mai', 'Đức Thành', 'Thị Linh'];
    
    return `${this.getRandomItem(firstNames)} ${this.getRandomItem(lastNames)}`;
  }

  private static generateRandomPhone(): string {
    const prefixes = ['090', '091', '094', '083', '084', '085', '081', '082'];
    const prefix = this.getRandomItem(prefixes);
    const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    
    return `${prefix}${suffix}`;
  }

  private static generateImageUrls(count: number): string[] {
    const images: string[] = [];
    
    for (let i = 1; i <= count; i++) {
      images.push(`https://example.com/property-images/image-${i}.jpg`);
    }
    
    return images;
  }
}