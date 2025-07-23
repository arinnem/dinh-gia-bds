-- Real Estate Valuation Platform Database Schema
-- PostgreSQL with PostGIS extension for spatial data

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS estimation_logs CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS valuations CASCADE;
DROP TABLE IF EXISTS property_images CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ml_models CASCADE;
DROP TABLE IF EXISTS wards CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS directions CASCADE;
DROP TABLE IF EXISTS legal_statuses CASCADE;
DROP TABLE IF EXISTS property_types CASCADE;

-- Create lookup tables first

-- 1. Property Types
CREATE TABLE property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Legal Statuses
CREATE TABLE legal_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- 3. Directions
CREATE TABLE directions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 4. Districts
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    province VARCHAR(100) NOT NULL
);

-- 5. Wards
CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    district_id INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE
);

-- 6. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'Standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    investor TEXT,
    description TEXT,
    address TEXT,
    scale TEXT,
    status VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ML Models
CREATE TABLE ml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) UNIQUE NOT NULL,
    model_file_path TEXT NOT NULL,
    performance_metrics JSONB,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    training_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_url TEXT UNIQUE NOT NULL,
    source_site VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(18, 2),
    area REAL,
    bedrooms SMALLINT,
    bathrooms SMALLINT,
    floors SMALLINT,
    frontage REAL,
    full_address TEXT,
    location GEOMETRY(Point, 4326),
    additional_features JSONB,
    avm_estimate DECIMAL(18, 2),
    published_at TIMESTAMPTZ,
    last_scraped_at TIMESTAMPTZ DEFAULT NOW(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    property_type_id INT NOT NULL REFERENCES property_types(id),
    legal_status_id INT REFERENCES legal_statuses(id),
    direction_id INT REFERENCES directions(id),
    ward_id INT REFERENCES wards(id),
    district_id INT NOT NULL REFERENCES districts(id)
);

-- 10. Price History
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    price DECIMAL(18, 2) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
);

-- 11. Property Images
CREATE TABLE property_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE
);

-- 11.1. Page Screenshots (for scraped pages)
CREATE TABLE page_screenshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    screenshot_url TEXT NOT NULL,
    page_url TEXT NOT NULL,
    screenshot_path TEXT,
    captured_at TIMESTAMPTZ DEFAULT NOW(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    file_size BIGINT,
    image_format VARCHAR(10) DEFAULT 'png'
);

-- 12. Valuations
CREATE TABLE valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value DECIMAL(18, 2) NOT NULL,
    avm_value_at_valuation DECIMAL(18, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id)
);

-- 13. User Favorites
CREATE TABLE user_favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, property_id)
);

-- 14. Estimation Logs
CREATE TABLE estimation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    input_features JSONB NOT NULL,
    estimated_price DECIMAL(18, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    model_id UUID NOT NULL REFERENCES ml_models(id),
    user_id UUID REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_properties_location ON properties USING GIST (location);
CREATE INDEX idx_properties_district ON properties (district_id);
CREATE INDEX idx_properties_property_type ON properties (property_type_id);
CREATE INDEX idx_properties_price ON properties (price);
CREATE INDEX idx_properties_area ON properties (area);
CREATE INDEX idx_price_history_property ON price_history (property_id);
CREATE INDEX idx_price_history_changed_at ON price_history (changed_at);
CREATE INDEX idx_estimation_logs_user ON estimation_logs (user_id);
CREATE INDEX idx_estimation_logs_created_at ON estimation_logs (created_at);
CREATE INDEX idx_page_screenshots_property ON page_screenshots (property_id);
CREATE INDEX idx_page_screenshots_captured_at ON page_screenshots (captured_at);
CREATE INDEX idx_page_screenshots_page_url ON page_screenshots (page_url);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_screenshots ENABLE ROW LEVEL SECURITY;

-- Users can see and manage their own data
CREATE POLICY "Users can see and manage their own data" ON users
    FOR ALL USING (id = current_setting('app.current_user_id')::UUID);

-- Public read-only access for properties, projects, price_history, property_images
CREATE POLICY "Public read-only access for properties" ON properties
    FOR SELECT USING (true);

CREATE POLICY "Public read-only access for projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Public read-only access for price history" ON price_history
    FOR SELECT USING (true);

CREATE POLICY "Public read-only access for property images" ON property_images
    FOR SELECT USING (true);

CREATE POLICY "Public read-only access for page screenshots" ON page_screenshots
    FOR SELECT USING (true);