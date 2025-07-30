# API Routes and Endpoints Documentation

## Overview
This document outlines all API routes and endpoints for the Vietnamese Real Estate Valuation Platform.

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.dinhgiabds.com/api
```

## Authentication
Most endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Versioning
All endpoints are versioned using URL path versioning:
```
/api/v1/...
```

---

## 1. Property Management

### 1.1 Property Listing

#### GET /api/v1/properties
**Description:** Get paginated list of properties with filtering and sorting

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `location` (string) - Filter by location/address
- `property_type` (string) - Filter by property type (apartment, house, land, etc.)
- `min_price` (number) - Minimum price filter
- `max_price` (number) - Maximum price filter
- `min_area` (number) - Minimum area filter
- `max_area` (number) - Maximum area filter
- `bedrooms` (number) - Number of bedrooms
- `bathrooms` (number) - Number of bathrooms
- `sort_by` (string) - Sort field (price, area, created_at, updated_at)
- `sort_order` (string) - Sort order (asc, desc)
- `source` (string) - Filter by data source

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_items": 200,
      "items_per_page": 20
    },
    "filters_applied": {...}
  }
}
```

#### GET /api/v1/properties/:id
**Description:** Get detailed information about a specific property

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "price": {
      "amount": 5000000000,
      "currency": "VND",
      "formatted": "5 tỷ VND"
    },
    "area": {
      "total": 120,
      "unit": "m2"
    },
    "address": {
      "full": "string",
      "district": "string",
      "city": "string",
      "coordinates": {
        "latitude": 10.762622,
        "longitude": 106.660172
      }
    },
    "features": {
      "bedrooms": 3,
      "bathrooms": 2,
      "floors": 1
    },
    "property_type": "apartment",
    "legal_status": "red_book",
    "direction": "south",
    "images": [...],
    "contact": {
      "name": "string",
      "phone": "string"
    },
    "source": "batdongsan",
    "url": "string",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### 1.2 Property Search

#### POST /api/v1/properties/search
**Description:** Advanced property search with complex filters

**Request Body:**
```json
{
  "query": "string",
  "filters": {
    "location": {
      "city": "Ho Chi Minh City",
      "district": "District 1",
      "radius_km": 5,
      "coordinates": {
        "latitude": 10.762622,
        "longitude": 106.660172
      }
    },
    "price_range": {
      "min": 1000000000,
      "max": 10000000000
    },
    "area_range": {
      "min": 50,
      "max": 200
    },
    "property_types": ["apartment", "house"],
    "features": {
      "min_bedrooms": 2,
      "min_bathrooms": 1
    }
  },
  "sort": {
    "field": "price",
    "order": "asc"
  },
  "pagination": {
    "page": 1,
    "limit": 20
  }
}
```

#### GET /api/v1/properties/similar/:id
**Description:** Find similar properties based on location, price, and features

**Query Parameters:**
- `limit` (number, default: 10) - Number of similar properties to return

---

## 2. Property Valuation (AVM)

### 2.1 Automated Valuation

#### POST /api/v1/valuation/estimate
**Description:** Get automated property valuation estimate

**Request Body:**
```json
{
  "property_id": "uuid", // Optional: for existing properties
  "property_details": { // Required if property_id not provided
    "address": "string",
    "area": 120,
    "property_type": "apartment",
    "bedrooms": 3,
    "bathrooms": 2,
    "floors": 1,
    "coordinates": {
      "latitude": 10.762622,
      "longitude": 106.660172
    }
  },
  "valuation_method": "comparative" // comparative, cost, income
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "estimated_value": {
      "amount": 5200000000,
      "currency": "VND",
      "formatted": "5.2 tỷ VND"
    },
    "confidence_score": 0.85,
    "value_range": {
      "min": 4800000000,
      "max": 5600000000
    },
    "comparable_properties": [...],
    "valuation_factors": {
      "location_score": 0.9,
      "property_condition": 0.8,
      "market_trends": 0.85
    },
    "methodology": "comparative",
    "valuation_date": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/v1/valuation/history/:property_id
**Description:** Get valuation history for a property

### 2.2 Comparable Properties

#### GET /api/v1/valuation/comparables/:property_id
**Description:** Get comparable properties for valuation analysis

**Query Parameters:**
- `radius_km` (number, default: 2) - Search radius in kilometers
- `limit` (number, default: 10) - Number of comparables to return

---

## 3. Market Analytics

### 3.1 Market Trends

#### GET /api/v1/analytics/market-trends
**Description:** Get market trend data for specific locations

**Query Parameters:**
- `location` (string, required) - City or district
- `property_type` (string) - Filter by property type
- `period` (string, default: "6m") - Time period (1m, 3m, 6m, 1y, 2y)

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "Ho Chi Minh City",
    "period": "6m",
    "trends": {
      "price_trend": {
        "direction": "increasing",
        "percentage_change": 5.2,
        "monthly_data": [...]
      },
      "volume_trend": {
        "total_listings": 1250,
        "monthly_data": [...]
      },
      "average_price_per_m2": 45000000
    }
  }
}
```

#### GET /api/v1/analytics/price-distribution
**Description:** Get price distribution data for a location

#### GET /api/v1/analytics/location-stats/:location
**Description:** Get comprehensive statistics for a specific location

---

## 4. Reports

### 4.1 Property Reports

#### POST /api/v1/reports/property
**Description:** Generate property valuation report

**Request Body:**
```json
{
  "property_id": "uuid",
  "report_type": "detailed", // basic, detailed, professional
  "include_comparables": true,
  "include_market_analysis": true,
  "format": "pdf" // pdf, excel, json
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report_id": "uuid",
    "download_url": "string",
    "expires_at": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/v1/reports/:report_id/download
**Description:** Download generated report

#### GET /api/v1/reports/history
**Description:** Get user's report generation history

---

## 5. Data Management

### 5.1 Data Sources

#### GET /api/v1/data/sources
**Description:** Get information about data sources and last update times

**Response:**
```json
{
  "success": true,
  "data": {
    "sources": [
      {
        "name": "batdongsan",
        "display_name": "BatDongSan.com.vn",
        "last_updated": "2024-01-01T00:00:00Z",
        "total_properties": 15000,
        "status": "active"
      }
    ]
  }
}
```

#### GET /api/v1/data/statistics
**Description:** Get overall data statistics

---

## 6. User Management (Future Phase)

### 6.1 Authentication

#### POST /api/v1/auth/register
**Description:** User registration

#### POST /api/v1/auth/login
**Description:** User login

#### POST /api/v1/auth/logout
**Description:** User logout

#### POST /api/v1/auth/refresh
**Description:** Refresh JWT token

### 6.2 User Profile

#### GET /api/v1/user/profile
**Description:** Get user profile

#### PUT /api/v1/user/profile
**Description:** Update user profile

---

## Error Responses

All endpoints return consistent error responses:

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

### Common Error Codes
- `VALIDATION_ERROR` - Invalid input parameters
- `NOT_FOUND` - Resource not found
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- **Public endpoints:** 100 requests per hour per IP
- **Authenticated endpoints:** 1000 requests per hour per user
- **Valuation endpoints:** 50 requests per hour per user
- **Report generation:** 10 reports per hour per user

## Response Headers

All responses include:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-Response-Time: 150ms
```