# Data Mapping Documentation

## Overview
This document provides a comprehensive mapping between Hero.js scrapers, database tables, and API routes for the Vietnamese Real Estate Valuation Platform.

---

## 1. Hero Scraper → Database Tables Mapping

### 1.1 ScrapedProperty Interface → Database Tables

| Scraper Field | Database Table | Database Field | Notes |
|---------------|----------------|----------------|---------|
| `title` | `properties` | `title` | Cleaned via DataProcessor |
| `description` | `properties` | `description` | Cleaned via DataProcessor |
| `price.amount` | `properties` | `price` | DECIMAL(18,2) |
| `price.amount` | `price_history` | `price` | Historical tracking |
| `area.total` | `properties` | `area` | REAL type |
| `features.bedrooms` | `properties` | `bedrooms` | SMALLINT |
| `features.bathrooms` | `properties` | `bathrooms` | SMALLINT |
| `features.floors` | `properties` | `floors` | SMALLINT |
| `address.full` | `properties` | `full_address` | Cleaned text |
| `address.district` | `districts` | `name` | Lookup/create |
| `address.ward` | `wards` | `name` | Lookup/create |
| `address.coordinates.lat/lng` | `properties` | `location` | PostGIS Point geometry |
| `propertyType` | `property_types` | `name` | Lookup/create |
| `legalStatus` | `legal_statuses` | `name` | Lookup/create |
| `direction` | `directions` | `name` | Lookup/create |
| `projectName` | `projects` | `name` | Lookup/create |
| `images[]` | `property_images` | `image_url` | Multiple records |
| `images[0]` | `property_images` | `is_thumbnail` | First image = true |
| `contact.name` | `properties` | `contact_name` | Via additional_features JSONB |
| `contact.phone` | `properties` | `contact_phone` | Via additional_features JSONB |
| `url` | `properties` | `source_url` | Unique constraint |
| `source` | `properties` | `source_site` | batdongsan/nha/alonhadat |
| `scrapedAt` | `properties` | `last_scraped_at` | TIMESTAMPTZ |
| `postedDate` | `properties` | `published_at` | TIMESTAMPTZ |

### 1.2 Scraper Configuration → Database

| Scraper Config | Database Usage | Notes |
|----------------|----------------|---------|
| `ScraperConfig.name` | `properties.source_site` | Identifies data source |
| `ScrapingSession` | `scraping_sessions` table | Session tracking |
| `ScraperResult` | `scraping_sessions.scraperResults` | JSONB field |

### 1.3 Data Processing Flow

```
Hero Scraper → ScrapedProperty → PropertyService.insertProperty() → Database Tables

1. ScrapedProperty validation
2. Lookup/create reference data (property_types, legal_statuses, etc.)
3. Insert main property record
4. Insert related records (images, price_history)
5. Transaction commit
```

---

## 2. Database Tables → API Routes Mapping

### 2.1 Properties API

#### GET /api/v1/properties
**Primary Tables:**
- `properties` (main data)
- `property_types` (JOIN for type name)
- `legal_statuses` (JOIN for status name)
- `directions` (JOIN for direction name)
- `districts` (JOIN for location)
- `wards` (JOIN for location)
- `projects` (JOIN for project info)

**Query Structure:**
```sql
SELECT p.*, pt.name as property_type, ls.name as legal_status,
       d.name as direction, dist.name as district, w.name as ward,
       proj.name as project_name
FROM properties p
LEFT JOIN property_types pt ON p.property_type_id = pt.id
LEFT JOIN legal_statuses ls ON p.legal_status_id = ls.id
LEFT JOIN directions d ON p.direction_id = d.id
LEFT JOIN districts dist ON p.district_id = dist.id
LEFT JOIN wards w ON p.ward_id = w.id
LEFT JOIN projects proj ON p.project_id = proj.id
```

#### GET /api/v1/properties/:id
**Tables:**
- `properties` (main)
- All reference tables (JOINs)
- `property_images` (related images)
- `price_history` (price trends)

### 2.2 Valuation API

#### POST /api/v1/valuation/estimate
**Input Tables:**
- `properties` (comparable properties)
- `districts` (location-based pricing)
- `property_types` (type-based analysis)

**Output Tables:**
- `estimation_logs` (log estimation requests)
- `ml_models` (model metadata)

#### GET /api/v1/valuation/comparables/:property_id
**Tables:**
- `properties` (spatial queries using PostGIS)
- Location-based filtering using `ST_DWithin()`

### 2.3 Market Analytics API

#### GET /api/v1/analytics/market-trends
**Tables:**
- `properties` (price data)
- `price_history` (historical trends)
- `districts` (location grouping)
- `property_types` (type-based analysis)

**Query Pattern:**
```sql
SELECT 
  DATE_TRUNC('month', created_at) as month,
  AVG(price) as avg_price,
  COUNT(*) as listing_count
FROM properties 
WHERE district_id = $1 
GROUP BY month
ORDER BY month
```

### 2.4 Reports API

#### POST /api/v1/reports/property
**Tables:**
- `properties` (main property data)
- All reference tables (complete property info)
- `property_images` (report images)
- `estimation_logs` (valuation history)

---

## 3. Complete Data Flow Mapping

### 3.1 Scraping → Storage → API Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Hero Scraper  │───▶│   Database       │───▶│   API Routes    │
│                 │    │                  │    │                 │
│ • BatDongSan    │    │ • properties     │    │ • GET /props    │
│ • Nha.com       │    │ • property_types │    │ • POST /search  │
│ • Alonhadat     │    │ • districts      │    │ • GET /similar  │
│                 │    │ • price_history  │    │ • POST /valuate │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 3.2 Data Transformation Layers

1. **Scraper Layer**: Raw HTML → ScrapedProperty interface
2. **Service Layer**: ScrapedProperty → Database records
3. **API Layer**: Database records → JSON responses

---

## 4. Database Schema Updates Needed

### 4.1 Missing Fields for API Requirements

**Add to `properties` table:**
```sql
-- Contact information (currently in additional_features JSONB)
ALTER TABLE properties ADD COLUMN contact_name VARCHAR(255);
ALTER TABLE properties ADD COLUMN contact_phone VARCHAR(50);
ALTER TABLE properties ADD COLUMN contact_email VARCHAR(255);

-- Additional property features
ALTER TABLE properties ADD COLUMN frontage REAL;
ALTER TABLE properties ADD COLUMN floors SMALLINT;

-- Scraping metadata
ALTER TABLE properties ADD COLUMN scraped_hash VARCHAR(64);
ALTER TABLE properties ADD COLUMN data_quality_score DECIMAL(3,2);
```

### 4.2 New Tables for Enhanced Features

**Scraping Sessions Table:**
```sql
CREATE TABLE scraping_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_name VARCHAR(255),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    total_properties_found INTEGER DEFAULT 0,
    total_properties_scraped INTEGER DEFAULT 0,
    successful_properties INTEGER DEFAULT 0,
    failed_properties INTEGER DEFAULT 0,
    total_errors INTEGER DEFAULT 0,
    sources TEXT[],
    scraper_results JSONB,
    status VARCHAR(50) DEFAULT 'running',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Property Comparisons Table:**
```sql
CREATE TABLE property_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    property_ids UUID[],
    comparison_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. API Response Mapping

### 5.1 Property List Response Structure

```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",                    // properties.id
        "title": "string",               // properties.title
        "price": {
          "amount": 5000000000,           // properties.price
          "currency": "VND",
          "formatted": "5 tỷ VND"
        },
        "area": {
          "total": 120,                   // properties.area
          "unit": "m2"
        },
        "address": {
          "full": "string",              // properties.full_address
          "district": "string",          // districts.name
          "city": "string"
        },
        "property_type": "apartment",    // property_types.name
        "source": "batdongsan",          // properties.source_site
        "created_at": "2024-01-01T00:00:00Z" // properties.created_at
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 200,
      "items_per_page": 20
    }
  }
}
```

### 5.2 Valuation Response Structure

```json
{
  "success": true,
  "data": {
    "estimated_value": {
      "amount": 5200000000,             // Calculated value
      "currency": "VND",
      "formatted": "5.2 tỷ VND"
    },
    "confidence_score": 0.85,          // Algorithm confidence
    "comparable_properties": [         // From properties table
      {
        "id": "uuid",
        "price": 5000000000,
        "area": 115,
        "distance_km": 0.5
      }
    ],
    "methodology": "comparative",       // Algorithm used
    "valuation_date": "2024-01-01T00:00:00Z"
  }
}
```

---

## 6. Performance Considerations

### 6.1 Database Indexes for API Performance

```sql
-- Property search indexes
CREATE INDEX idx_properties_price_range ON properties (price) WHERE price IS NOT NULL;
CREATE INDEX idx_properties_area_range ON properties (area) WHERE area IS NOT NULL;
CREATE INDEX idx_properties_bedrooms ON properties (bedrooms) WHERE bedrooms IS NOT NULL;
CREATE INDEX idx_properties_district_type ON properties (district_id, property_type_id);

-- Spatial indexes for location-based queries
CREATE INDEX idx_properties_location_gist ON properties USING GIST (location);

-- Full-text search indexes
CREATE INDEX idx_properties_title_search ON properties USING GIN (to_tsvector('english', title));
CREATE INDEX idx_properties_description_search ON properties USING GIN (to_tsvector('english', description));
```

### 6.2 API Caching Strategy

- **Property Lists**: Cache for 5 minutes
- **Market Analytics**: Cache for 1 hour
- **Property Details**: Cache for 15 minutes
- **Valuation Results**: Cache for 30 minutes

---

## 7. Data Quality & Validation

### 7.1 Scraper Data Validation

| Field | Validation Rule | Error Handling |
|-------|----------------|----------------|
| `price.amount` | > 0, < 1 trillion VND | Skip property |
| `area.total` | > 0, < 10000 m² | Skip property |
| `address.full` | Not empty, min 10 chars | Skip property |
| `title` | Not empty, min 5 chars | Skip property |
| `url` | Valid URL format | Skip property |

### 7.2 API Data Sanitization

- All text fields: HTML entity encoding
- Price formatting: Vietnamese currency format
- Coordinate validation: Vietnam bounds check
- Image URLs: HTTPS validation

---

## 8. Error Handling & Logging

### 8.1 Scraper Error Mapping

| Scraper Error | Database Log | API Response |
|---------------|--------------|---------------|
| Network timeout | `scraping_sessions.scraper_results` | 500 Internal Error |
| Invalid data format | Skip property, log error | Continue processing |
| Duplicate URL | Update existing record | 200 Success |
| Database constraint | Rollback transaction | 500 Internal Error |

### 8.2 API Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "price",
      "message": "Price must be a positive number"
    }
  }
}
```

This mapping document serves as the authoritative reference for data flow between all system components.