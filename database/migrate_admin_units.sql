-- Migration for normalized administrative units (provinces, districts, wards)

-- 1. Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- 2. Add columns to districts
ALTER TABLE districts
    ADD COLUMN IF NOT EXISTS code VARCHAR(10) UNIQUE,
    ADD COLUMN IF NOT EXISTS type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS province_id INT REFERENCES provinces(id) ON DELETE CASCADE;

-- 3. Add columns to wards
ALTER TABLE wards
    ADD COLUMN IF NOT EXISTS code VARCHAR(10) UNIQUE,
    ADD COLUMN IF NOT EXISTS type VARCHAR(50);

-- (Optional) You may drop the old columns after verifying data migration
-- ALTER TABLE districts DROP COLUMN province; 