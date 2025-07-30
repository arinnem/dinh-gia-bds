-- Create separate tables for new structure administrative units (after July 1st, 2025)

-- New structure provinces table
CREATE TABLE IF NOT EXISTS provinces_new (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- New structure wards table (no districts in new structure)
CREATE TABLE IF NOT EXISTS wards_new (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    province_id INT NOT NULL REFERENCES provinces_new(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wards_new_province ON wards_new (province_id);
CREATE INDEX IF NOT EXISTS idx_wards_new_code ON wards_new (code);
CREATE INDEX IF NOT EXISTS idx_provinces_new_code ON provinces_new (code); 