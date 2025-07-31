-- Migration: Add address conversion fields to properties table
-- This migration adds fields to track address conversion from old format to new format

-- Add new columns for address conversion tracking
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS is_address_converted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS original_address TEXT,
ADD COLUMN IF NOT EXISTS converted_address TEXT,
ADD COLUMN IF NOT EXISTS conversion_error TEXT,
ADD COLUMN IF NOT EXISTS address_conversion_date TIMESTAMPTZ;

-- Add index for address conversion queries
CREATE INDEX IF NOT EXISTS idx_properties_address_converted ON properties (is_address_converted);
CREATE INDEX IF NOT EXISTS idx_properties_conversion_date ON properties (address_conversion_date);

-- Add comment to document the new fields
COMMENT ON COLUMN properties.is_address_converted IS 'Whether the address was converted from old format (with district) to new format (without district)';
COMMENT ON COLUMN properties.original_address IS 'Original address string before conversion';
COMMENT ON COLUMN properties.converted_address IS 'Converted address string after conversion';
COMMENT ON COLUMN properties.conversion_error IS 'Error message if address conversion failed';
COMMENT ON COLUMN properties.address_conversion_date IS 'Timestamp when address conversion was performed'; 