Units and measures will be Vietnamese based. Decimal numbers will use commas as separators like Western countries.

## Phase 1: Database Foundation (Weeks 1-2)
### 1.1 Database Schema Setup
- 1.1.1 Core Infrastructure
  
  - 1.1.1.1 Setup Docker PostgreSQL with PostGIS extension
  - 1.1.1.2 Create database connection configuration
  - 1.1.1.3 Setup database migration system
  - Test: Verify database connection and PostGIS functionality
  - Checkpoint: Database infrastructure ready
- 1.1.2 Core Tables Creation
  
  - 1.1.2.1 Create users table with RLS policies
  - 1.1.2.2 Create lookup tables (property_types, legal_statuses, directions, districts, wards)
  - 1.1.2.3 Create projects table with RLS policies
  - Test: Verify table creation and constraints
  - Checkpoint: Core tables structure complete
- 1.1.3 Property and Related Tables
  
  - 1.1.3.1 Create properties table with geometry fields
  - 1.1.3.2 Create property_images table
  - 1.1.3.3 Create price_history table
  - Test: Verify foreign key relationships and geometry functions
  - Checkpoint: Property data structure ready
- 1.1.4 Advanced Tables
  
  - 1.1.4.1 Create valuations table with professional user restrictions
  - 1.1.4.2 Create user_favorites table
  - 1.1.4.3 Create ml_models and estimation_logs tables
  - Test: Verify RLS policies and user permissions
  - Checkpoint: Complete database schema implemented
### 1.2 Database Seeding
- 1.2.1 Lookup Data Population
  
  - 1.2.1.1 Insert property types data (8 types)
  - 1.2.1.2 Insert legal statuses data (9 statuses)
  - 1.2.1.3 Insert directions data (8 directions)
  - Test: Verify lookup data integrity
  - Checkpoint: Lookup tables populated
- 1.2.2 Geographic Data
  
  - 1.2.2.1 Insert districts data for 10 major cities (50+ districts)
  - 1.2.2.2 Insert wards data for populated districts (200+ wards)
  - 1.2.2.3 Create geographic indexes for performance
  - Test: Verify geographic relationships and queries
  - Checkpoint: Geographic data structure complete
- 1.2.3 Sample Data Creation
  
  - 1.2.3.1 Create sample users (10 standard, 5 professional)
  - 1.2.3.2 Create sample projects (10 projects)
  - 1.2.3.3 Create sample properties (50+ properties with coordinates)
  - Test: Verify sample data relationships and constraints
  - Checkpoint: Database ready with sample data
## Phase 2: Hero.js Data Collection System (Weeks 3-4)
### 2.1 Hero.js Scraper Infrastructure
- 2.1.1 Hero.js Environment Setup
  
  - 2.1.1.1 Install Hero.js and configure TypeScript environment
  - 2.1.1.2 Create Hero.js connection pool and session management
  - 2.1.1.3 Setup proxy rotation and stealth configurations
  - Test: Verify Hero.js can navigate to Vietnamese real estate sites
  - Checkpoint: Hero.js foundation ready
- 2.1.2 Base Scraper Framework with Hero.js
  
  - 2.1.2.1 Create base Hero scraper class with error handling
  - 2.1.2.2 Implement intelligent wait strategies and element detection
  - 2.1.2.3 Setup request interception and response caching
  - Test: Verify Hero.js can handle dynamic content loading
  - Checkpoint: Hero.js scraper framework operational
- 2.1.3 Data Processing Pipeline
  
  - 2.1.3.1 Create data validation and cleaning utilities
  - 2.1.3.2 Implement price parsing and normalization for Vietnamese format
  - 2.1.3.3 Create address geocoding service integration (Google Maps API)
  - Test: Verify data processing accuracy with Vietnamese text
  - Checkpoint: Data processing pipeline functional
### 2.2 Vietnamese Real Estate Site Scrapers with Hero.js
- 2.2.1 BatDongSan.com.vn Hero.js Scraper
  
  - 2.2.1.1 Implement Hero.js navigation for BDS listing pages
  - 2.2.1.2 Extract property details using Hero.js DOM manipulation
  - 2.2.1.3 Handle infinite scroll and dynamic loading with Hero.js
  - Test: Scrape 50+ BDS listings successfully with Hero.js
  - Checkpoint: BDS Hero.js scraper operational
- 2.2.2 Nha.com.vn Hero.js Scraper
  
  - 2.2.2.1 Implement Hero.js scraper for Nha.com.vn structure
  - 2.2.2.2 Handle anti-bot measures using Hero.js stealth features
  - 2.2.2.3 Extract property images and contact information
  - Test: Scrape 50+ Nha.com.vn listings with Hero.js
  - Checkpoint: Nha.com.vn Hero.js scraper ready
- 2.2.3 Alonhadat.com.vn Hero.js Scraper
  
  - 2.2.3.1 Create Hero.js scraper for Alonhadat.com.vn
  - 2.2.3.2 Implement CAPTCHA detection and handling with Hero.js
  - 2.2.3.3 Create unified data format converter for all sources
  - Test: Scrape 50+ Alonhadat listings with Hero.js
  - Checkpoint: Multi-source Hero.js scrapers ready
### 2.3 Advanced Hero.js Features and Data Storage
- 2.3.1 Hero.js Anti-Detection Measures
  
  - 2.3.1.1 Implement human-like browsing patterns with Hero.js
  - 2.3.1.2 Setup fingerprint randomization and user agent rotation
  - 2.3.1.3 Create session persistence and cookie management
  - Test: Verify scrapers can run continuously without detection
  - Checkpoint: Stealth scraping capabilities implemented
- 2.3.2 Database Integration with Hero.js Data
  
  - 2.3.2.1 Create database insertion utilities for Hero.js scraped data
  - 2.3.2.2 Implement duplicate detection by URL and content similarity
  - 2.3.2.3 Handle image URL extraction and local storage/CDN upload
  - Test: Store 100+ unique properties from Hero.js scrapers
  - Checkpoint: Hero.js scraper-database integration complete
- 2.3.3 Hero.js Monitoring and Orchestration
  
  - 2.3.3.1 Implement Hero.js session monitoring and health checks
  - 2.3.3.2 Create distributed scraping with multiple Hero.js instances
  - 2.3.3.3 Setup automated scheduling and error recovery
  - Test: Verify Hero.js scraping system reliability
  - Checkpoint: Production-ready Hero.js scraping system
## Phase 3: Backend API Development (Weeks 5-6)
### 3.1 API Infrastructure
- 3.1.1 Express.js Setup
  
  - 3.1.1.1 Initialize Node.js/Express project with TypeScript
  - 3.1.1.2 Setup database connection with connection pooling
  - 3.1.1.3 Configure CORS, helmet, and security middleware
  - Test: Verify server startup and database connectivity
  - Checkpoint: API foundation ready
### 3.2 Core API Endpoints
- 3.2.1 Property Search APIs
  
  - 3.2.1.1 GET /api/properties - Property listing with filters
  - 3.2.1.2 GET /api/properties/:id - Property details
  - 3.2.1.3 GET /api/properties/search - Advanced search with geo queries
  - Test: Verify search functionality and performance
  - Checkpoint: Property search APIs ready
### 3.3 Advanced API Features
- 3.3.1 Valuation APIs
  
  - 3.3.1.1 POST /api/valuations - Create manual valuation (professionals only)
  - 3.3.1.2 GET /api/valuations/:propertyId - Get property valuations
  - 3.3.1.3 POST /api/estimate - AVM price estimation
  - Test: Verify valuation system
  - Checkpoint: Valuation APIs functional
- 3.3.2 Hero.js Scraper Management APIs
  
  - 3.3.2.1 GET /api/admin/scraper/status - Monitor Hero.js scraper health
  - 3.3.2.2 POST /api/admin/scraper/trigger - Manually trigger Hero.js scraping
  - 3.3.2.3 GET /api/admin/scraper/logs - View Hero.js scraping logs
  - Test: Verify scraper management functionality
  - Checkpoint: Hero.js management APIs ready
## Phase 4: AVM Implementation (Weeks 7-8)
### 4.1 Data Preparation
- 4.1.1 Feature Engineering
  
  - 4.1.1.1 Create property feature extraction utilities
  - 4.1.1.2 Implement location-based feature calculation
  - 4.1.1.3 Generate market trend features from Hero.js scraped data
  - Test: Verify feature quality and completeness
  - Checkpoint: Feature engineering pipeline ready
- 4.1.2 Training Data Preparation
  
  - 4.1.2.1 Clean and validate property price data from Hero.js sources
  - 4.1.2.2 Handle missing values and outliers in Vietnamese market data
  - 4.1.2.3 Create train/validation/test splits with temporal considerations
  - Test: Verify data quality and distribution
  - Checkpoint: Training data ready
### 4.2 Model Development
- 4.2.1 Baseline Models
  
  - 4.2.1.1 Implement linear regression baseline
  - 4.2.1.2 Create random forest model
  - 4.2.1.3 Implement gradient boosting model (XGBoost/LightGBM)
  - Test: Achieve baseline accuracy metrics
  - Checkpoint: Multiple models trained and evaluated
- 4.2.2 Model Optimization
  
  - 4.2.2.1 Hyperparameter tuning for best model
  - 4.2.2.2 Feature selection and importance analysis
  - 4.2.2.3 Cross-validation and performance metrics
  - Test: Achieve 85%+ accuracy target
  - Checkpoint: Optimized model ready for production
### 4.3 Model Integration
- 4.3.1 Model Serving
  
  - 4.3.1.1 Create model serialization and loading utilities
  - 4.3.1.2 Implement prediction API endpoint
  - 4.3.1.3 Setup model versioning system
  - Test: Verify model predictions via API
  - Checkpoint: AVM integrated with backend
- 4.3.2 Monitoring and Updates
  
  - 4.3.2.1 Implement prediction logging
  - 4.3.2.2 Create model performance monitoring
  - 4.3.2.3 Setup automated retraining pipeline with Hero.js fresh data
  - Test: Verify monitoring and logging functionality
  - Checkpoint: Production AVM system complete
## Phase 5: Frontend Development (Weeks 9-11)
### 5.1 React Application Setup
- 5.1.1 Project Initialization
  
  - 5.1.1.1 Create React app with TypeScript and Tailwind CSS
  - 5.1.1.2 Setup routing with React Router
  - 5.1.1.3 Configure state management (Redux Toolkit/Zustand)
  - Test: Verify app startup and basic navigation
  - Checkpoint: Frontend foundation ready
- 5.1.2 UI Component Library
  
  - 5.1.2.1 Create reusable UI components (Button, Input, Card)
  - 5.1.2.2 Implement responsive layout components
  - 5.1.2.3 Setup design system with Tailwind utilities
  - Test: Verify component reusability and responsiveness
  - Checkpoint: UI component library ready
### 5.2 Core Pages Development
- 5.2.1 Property Listing Pages
  
  - 5.2.1.1 Create property search page with filters
  - 5.2.1.2 Implement property card components
  - 5.2.1.3 Add pagination and infinite scroll
  - Test: Verify property browsing experience
  - Checkpoint: Property listing functionality ready
### 5.3 Advanced Features
- 5.3.1 Property Details and Maps
  
  - 5.3.1.1 Create detailed property view page
  - 5.3.1.2 Integrate map component (Leaflet/Google Maps)
  - 5.3.1.3 Implement image gallery with lightbox
  - Test: Verify property details display
  - Checkpoint: Property details page complete
### 5.2 Professional Features
- 5.2.1 Valuation Tools
  
  - 5.2.1.1 Create AVM estimation form
  - 5.2.1.2 Implement manual valuation form (professionals)
  - 5.2.1.3 Add property comparison tool
  - Test: Verify valuation tools functionality
  - Checkpoint: Valuation features complete
- 5.2.2 Analytics Dashboard
  
  - 5.2.2.1 Create market analytics charts
  - 5.2.2.2 Implement price trend visualizations
  - 5.2.2.3 Add export functionality for reports
  - Test: Verify analytics and export features
  - Checkpoint: Analytics dashboard ready
- 5.2.3 Hero.js Scraper Monitoring UI
  
  - 5.2.3.1 Create scraper status dashboard for admins
  - 5.2.3.2 Implement real-time scraping progress visualization
  - 5.2.3.3 Add scraper configuration and control panel
  - Test: Verify scraper monitoring interface
  - Checkpoint: Hero.js monitoring UI complete
## Phase 6: Integration and Testing (Weeks 12-13)
### 6.1 Frontend-Backend Integration
- 6.1.1 API Integration
  
  - 6.1.1.1 Setup Axios/Fetch API client with interceptors
  - 6.1.1.2 Implement error handling and loading states
  - 6.1.1.3 Add API response caching strategy
  - Test: Verify all API endpoints work with frontend
  - Checkpoint: Full API integration complete
- 6.1.2 Real-time Features
  
  - 6.1.2.1 Implement WebSocket connection for live updates
  - 6.1.2.2 Add real-time price change notifications from Hero.js
  - 6.1.2.3 Setup push notifications for favorites
  - Test: Verify real-time functionality
  - Checkpoint: Real-time features operational
### 6.2 Performance Optimization
- 6.2.1 Frontend Optimization
  
  - 6.2.1.1 Implement code splitting and lazy loading
  - 6.2.1.2 Optimize images and assets
  - 6.2.1.3 Add service worker for caching
  - Test: Verify performance metrics (Lighthouse score >90)
  - Checkpoint: Frontend performance optimized
- 6.2.2 Backend Optimization
  
  - 6.2.2.1 Implement database query optimization
  - 6.2.2.2 Add Redis caching for frequent queries
  - 6.2.2.3 Setup API rate limiting
  - Test: Verify API response times <500ms
  - Checkpoint: Backend performance optimized
- 6.2.3 Hero.js Scraper Optimization
  
  - 6.2.3.1 Optimize Hero.js resource usage and memory management
  - 6.2.3.2 Implement intelligent scheduling to avoid peak hours
  - 6.2.3.3 Setup Hero.js cluster management for scalability
  - Test: Verify Hero.js can handle 1000+ properties/hour
  - Checkpoint: Hero.js scraping system optimized
### 6.3 Testing and Quality Assurance
- 6.3.1 Automated Testing
  
  - 6.3.1.1 Setup unit tests for critical functions
  - 6.3.1.2 Implement integration tests for API endpoints
  - 6.3.1.3 Add end-to-end tests for user flows
  - Test: Achieve >80% test coverage
  - Checkpoint: Comprehensive testing suite ready
- 6.3.2 Hero.js Scraper Testing
  
  - 6.3.2.1 Create Hero.js scraper unit tests with mock responses
  - 6.3.2.2 Implement integration tests for each target website
  - 6.3.2.3 Setup continuous monitoring for website structure changes
  - Test: Verify Hero.js scrapers handle edge cases
  - Checkpoint: Hero.js scraping system thoroughly tested
- 6.3.3 User Acceptance Testing
  
  - 6.3.3.1 Conduct usability testing with target users
  - 6.3.3.2 Test AVM accuracy with real property data from Hero.js
  - 6.3.3.3 Validate Hero.js scraper data quality and completeness
  - Test: Meet all acceptance criteria
  - Checkpoint: System ready for production deployment
## Phase 7: Authentication and User Management (Weeks 14-15)
### 7.1 Backend Authentication System
- 7.1.1 Authentication Infrastructure
  
  - 7.1.1.1 Implement JWT-based authentication
  - 7.1.1.2 Create user registration and login endpoints
  - 7.1.1.3 Setup role-based authorization middleware
  - Test: Verify user authentication flow
  - Checkpoint: Authentication system functional
- 7.1.2 User Management APIs
  
  - 7.1.2.1 POST /api/auth/register - User registration
  - 7.1.2.2 POST /api/auth/login - User login
  - 7.1.2.3 GET /api/users/profile - User profile management
  - Test: Verify user management functionality
  - Checkpoint: User APIs complete
- 7.1.3 User Interaction APIs
  
  - 7.1.3.1 POST /api/favorites - Add property to favorites
  - 7.1.3.2 GET /api/favorites - Get user favorites
  - 7.1.3.3 DELETE /api/favorites/:id - Remove from favorites
  - Test: Verify favorites functionality
  - Checkpoint: User interaction APIs complete
### 7.2 Frontend Authentication Integration
- 7.2.1 Authentication Pages
  
  - 7.2.1.1 Create login page with form validation
  - 7.2.1.2 Create registration page with role selection
  - 7.2.1.3 Implement protected route wrapper
  - Test: Verify authentication flow
  - Checkpoint: Authentication UI complete
- 7.2.2 User Dashboard
  
  - 7.2.2.1 Create user profile management page
  - 7.2.2.2 Implement favorites list with management
  - 7.2.2.3 Add estimation history for logged users
  - Test: Verify user dashboard functionality
  - Checkpoint: User dashboard ready
### 7.3 Authentication Integration and Testing
- 7.3.1 Full System Integration
  
  - 7.3.1.1 Integrate authentication with existing property features
  - 7.3.1.2 Update API endpoints to support authenticated users
  - 7.3.1.3 Implement session management and token refresh
  - Test: Verify seamless integration with existing features
  - Checkpoint: Authentication fully integrated
- 7.3.2 Security and Performance
  
  - 7.3.2.1 Implement security best practices (password hashing, rate limiting)
  - 7.3.2.2 Add user data validation and sanitization
  - 7.3.2.3 Optimize authentication performance
  - Test: Verify security measures and performance
  - Checkpoint: Authentication system production-ready
## Final Deliverables
- ✅ Complete database schema with 100+ property listings
- ✅ Hero.js-powered multi-source scraper collecting Vietnamese real estate data
- ✅ RESTful API with authentication and authorization
- ✅ AVM model with 85%+ accuracy trained on Hero.js data
- ✅ Responsive React frontend with TypeScript and Tailwind
- ✅ Full integration between frontend and backend
- ✅ Hero.js scraper monitoring and management system
- ✅ Docker containerization for easy deployment
- ✅ Comprehensive testing suite including Hero.js scraper tests
- ✅ Performance optimization for production use
## Hero.js Specific Technical Requirements
### Hero.js Configuration
- Stealth Mode: Enable all anti-detection features
- Session Management: Implement session pooling for efficiency
- Proxy Support: Rotate proxies to avoid IP blocking
- Resource Optimization: Block unnecessary resources (ads, analytics)
- Error Handling: Implement robust retry mechanisms
- Monitoring: Track success rates and performance metrics
### Vietnamese Market Considerations
- Language Support: Handle Vietnamese text encoding properly
- Currency Parsing: Parse Vietnamese dong (VNĐ) format correctly
- Address Geocoding: Integrate with Vietnamese mapping services
- Legal Compliance: Respect robots.txt and rate limiting
- Data Quality: Implement validation for Vietnamese property data