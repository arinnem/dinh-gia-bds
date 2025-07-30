-- Fix wards table to allow NULL district_id for new structure
-- First, drop any existing constraints
ALTER TABLE wards DROP CONSTRAINT IF EXISTS wards_district_id_fkey;

-- Allow NULL values in district_id
ALTER TABLE wards ALTER COLUMN district_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULL
ALTER TABLE wards ADD CONSTRAINT wards_district_id_fkey 
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE; 