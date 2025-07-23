# Vietnamese Real Estate Scraper

A comprehensive web scraping system for Vietnamese real estate websites using Hero.js (Ulixee). This system scrapes property listings from major Vietnamese real estate platforms and stores them in a PostgreSQL database.

## 🌟 Features

- **Multi-site Support**: Scrapes from BatDongSan.com.vn, Nha.com.vn, and Alonhadat.com.vn
- **Hero.js Integration**: Uses advanced browser automation with stealth capabilities
- **Anti-Detection**: Implements user agent rotation, viewport randomization, and request delays
- **Database Integration**: Stores scraped data in PostgreSQL with proper normalization
- **Error Handling**: Comprehensive error handling and retry mechanisms
- **Session Tracking**: Tracks scraping sessions with detailed statistics
- **TypeScript**: Fully typed for better development experience

## 🏗️ Architecture

```
scraper/
├── src/
│   ├── scrapers/           # Individual website scrapers
│   │   ├── baseScraper.ts   # Base scraper class
│   │   ├── batdongsanScraper.ts
│   │   ├── nhaScraper.ts
│   │   ├── alonhadatScraper.ts
│   │   └── index.ts         # Scraper orchestrator
│   ├── config/             # Configuration files
│   │   ├── database.ts      # Database configuration
│   │   └── scrapers.ts      # Scraper configurations
│   ├── database/           # Database services
│   │   └── propertyService.ts
│   ├── utils/              # Utility functions
│   │   └── dataProcessor.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts            # Main entry point
├── tests/                  # Test files
├── .env.example           # Environment variables template
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/pnpm
- PostgreSQL database
- Environment variables configured

### Installation

1. **Navigate to scraper directory**:
   ```bash
   cd scraper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Test database connection**:
   ```bash
   npm run test:db
   ```

5. **Start scraping**:
   ```bash
   npm run scrape
   ```

## 📋 Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dinh_gia_bds
DB_USER=your_username
DB_PASSWORD=your_password

# Scraper Settings
SCRAPER_DELAY_MIN=2000
SCRAPER_DELAY_MAX=5000
SCRAPER_TIMEOUT=30000
SCRAPER_RETRIES=3

# Hero.js Configuration
HERO_STEALTH_MODE=true
HERO_BLOCK_ADS=true
HERO_BLOCK_ANALYTICS=true

# Optional: Proxy Settings
# PROXY_HOST=
# PROXY_PORT=
# PROXY_USERNAME=
# PROXY_PASSWORD=

# Optional: Geocoding API
# GEOCODING_API_KEY=

# Logging
LOG_LEVEL=info
LOG_FILE=scraper.log
```

## 🎯 Usage

### Command Line Interface

```bash
# Show help
npm run scrape -- --help

# Run all scrapers (default: 50 properties each)
npm run scrape
npm run scrape:all

# Run specific scraper
npm run scrape:batdongsan
npm run scrape:nha
npm run scrape:alonhadat

# Custom number of properties
npm run scrape -- --properties 100

# Run specific scraper with custom count
npm run scrape -- --scraper batdongsan --properties 75

# Test database connection
npm run test:db

# List available scrapers
npm run list:scrapers
```

### Programmatic Usage

```typescript
import { ScraperOrchestrator, BatDongSanScraper } from './src/scrapers';

// Run all scrapers
const orchestrator = new ScraperOrchestrator();
const session = await orchestrator.runAllScrapers(50);
console.log('Session result:', session);

// Run individual scraper
const batdongsan = new BatDongSanScraper();
await batdongsan.startScraping(25);
const properties = batdongsan.getScrapedProperties();
```

## 🏠 Scraped Data Structure

Each property includes:

```typescript
interface ScrapedProperty {
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    unit: 'total' | 'per_m2';
    negotiable: boolean;
  };
  address: {
    full: string;
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  area: {
    total: number;
    usable?: number;
    unit: string;
  };
  propertyType: string;
  legalStatus: string;
  direction?: string;
  features: {
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
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
    email?: string;
  };
  url: string;
  source: string;
  scrapedAt: Date;
  hash: string;
}
```

## 🛠️ Development

### Building

```bash
# Build TypeScript
npm run build

# Run built version
npm start

# Development mode with auto-reload
npm run dev
```

### Testing

```bash
# Test database connection
npm run test:db

# Run specific scraper for testing
npm run scrape -- --scraper batdongsan --properties 5
```

### Adding New Scrapers

1. **Create scraper class**:
   ```typescript
   // src/scrapers/newSiteScraper.ts
   import { BaseScraper } from './baseScraper';
   
   export class NewSiteScraper extends BaseScraper {
     // Implement abstract methods
   }
   ```

2. **Add configuration**:
   ```typescript
   // src/config/scrapers.ts
   export const scraperConfigs = {
     // ... existing configs
     newsite: {
       name: 'newsite.com.vn',
       baseUrl: 'https://newsite.com.vn',
       // ... other config
     }
   };
   ```

3. **Register in orchestrator**:
   ```typescript
   // src/scrapers/index.ts
   this.scrapers.set('newsite', new NewSiteScraper());
   ```

## 🔧 Configuration

### Scraper Settings

- **Delays**: Configure delays between requests to avoid rate limiting
- **Retries**: Set number of retry attempts for failed requests
- **Timeouts**: Configure request timeouts
- **User Agents**: Rotate user agents for stealth
- **Viewports**: Randomize browser viewport sizes

### Database Settings

- **Connection Pool**: Configurable connection pooling
- **Query Timeout**: Set database query timeouts
- **Retry Logic**: Database operation retry mechanisms

## 📊 Monitoring

### Session Tracking

Each scraping session is tracked with:
- Session ID and timestamps
- Total properties scraped
- Error counts and details
- Performance metrics
- Individual scraper results

### Logging

Configurable logging levels:
- `error`: Only errors
- `warn`: Warnings and errors
- `info`: General information (default)
- `debug`: Detailed debugging information

## 🚨 Error Handling

### Common Issues

1. **Database Connection Failed**:
   - Check database credentials in `.env`
   - Ensure PostgreSQL is running
   - Verify network connectivity

2. **Scraping Errors**:
   - Website structure changes
   - Rate limiting or blocking
   - Network timeouts

3. **Hero.js Issues**:
   - Browser automation failures
   - Memory issues with large scraping sessions
   - Stealth detection

### Troubleshooting

```bash
# Enable debug logging
LOG_LEVEL=debug npm run scrape

# Test individual components
npm run test:db
npm run scrape -- --scraper batdongsan --properties 1

# Check scraper availability
npm run list:scrapers
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Vietnamese Real Estate Valuation System.

## 🔗 Related

- [Main Project Documentation](../README.md)
- [Database Schema](../database/README.md)
- [API Documentation](../api/README.md)
- [Frontend Documentation](../frontend/README.md)

---

**Note**: This scraper is designed for educational and research purposes. Please respect website terms of service and implement appropriate rate limiting when scraping.