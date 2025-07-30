-- Migration to allow NULL district_id in wards table for new structure
ALTER TABLE wards ALTER COLUMN district_id DROP NOT NULL; 