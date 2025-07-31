-- Migration: Add price_per_sqm index
-- This migration adds an index for the price_per_sqm column for better query performance

-- Add index for price_per_sqm column
CREATE INDEX IF NOT EXISTS idx_properties_price_per_sqm ON properties (price_per_sqm);

-- Update existing records to calculate price_per_sqm
UPDATE properties 
SET price_per_sqm = CASE 
    WHEN area > 0 THEN price / area 
    ELSE NULL 
END 
WHERE price_per_sqm IS NULL AND area > 0; 