-- Comprehensive Database Test Script
-- Tests for normalization, data integrity, relationships, and Phase 1 requirements

-- Test 1: Check if all required tables exist
SELECT 'Test 1: Table Existence Check' as test_name;
SELECT 
    table_name,
    CASE WHEN table_name IN (
        'property_types', 'legal_statuses', 'directions', 'districts', 'wards',
        'users', 'projects', 'ml_models', 'properties', 'price_history',
        'property_images', 'page_screenshots', 'valuations', 'user_favorites', 'estimation_logs'
    ) THEN 'PASS' ELSE 'FAIL' END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Test 2: Check Phase 1 data quantity requirements
SELECT 'Test 2: Data Quantity Requirements' as test_name;

-- Check districts (should be 50+)
SELECT 
    'Districts' as entity,
    COUNT(*) as actual_count,
    50 as required_minimum,
    CASE WHEN COUNT(*) >= 50 THEN 'PASS' ELSE 'FAIL' END as status
FROM districts
UNION ALL

-- Check wards (should be 200+)
SELECT 
    'Wards' as entity,
    COUNT(*) as actual_count,
    200 as required_minimum,
    CASE WHEN COUNT(*) >= 200 THEN 'PASS' ELSE 'FAIL' END as status
FROM wards
UNION ALL

-- Check users (should be 15+: 10 standard + 5 professional)
SELECT 
    'Users Total' as entity,
    COUNT(*) as actual_count,
    15 as required_minimum,
    CASE WHEN COUNT(*) >= 15 THEN 'PASS' ELSE 'FAIL' END as status
FROM users
UNION ALL

-- Check standard users (should be 10+)
SELECT 
    'Standard Users' as entity,
    COUNT(*) as actual_count,
    10 as required_minimum,
    CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END as status
FROM users WHERE role = 'Standard'
UNION ALL

-- Check professional users (should be 5+)
SELECT 
    'Professional Users' as entity,
    COUNT(*) as actual_count,
    5 as required_minimum,
    CASE WHEN COUNT(*) >= 5 THEN 'PASS' ELSE 'FAIL' END as status
FROM users WHERE role = 'Professional'
UNION ALL

-- Check projects (should be 10+)
SELECT 
    'Projects' as entity,
    COUNT(*) as actual_count,
    10 as required_minimum,
    CASE WHEN COUNT(*) >= 10 THEN 'PASS' ELSE 'FAIL' END as status
FROM projects
UNION ALL

-- Check properties (should be 50+)
SELECT 
    'Properties' as entity,
    COUNT(*) as actual_count,
    50 as required_minimum,
    CASE WHEN COUNT(*) >= 50 THEN 'PASS' ELSE 'FAIL' END as status
FROM properties;

-- Test 3: Check geographic data distribution
SELECT 'Test 3: Geographic Data Distribution' as test_name;

-- Check number of cities/provinces
SELECT 
    'Cities/Provinces' as entity,
    COUNT(DISTINCT province) as actual_count,
    10 as required_minimum,
    CASE WHEN COUNT(DISTINCT province) >= 10 THEN 'PASS' ELSE 'FAIL' END as status
FROM districts;

-- Show distribution by province
SELECT 
    province,
    COUNT(*) as district_count,
    (SELECT COUNT(*) FROM wards w JOIN districts d ON w.district_id = d.id WHERE d.province = districts.province) as ward_count
FROM districts
GROUP BY province
ORDER BY district_count DESC;

-- Test 4: Check database normalization and relationships
SELECT 'Test 4: Database Normalization and Relationships' as test_name;

-- Check foreign key constraints exist
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    'PASS' as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;

-- Test 5: Check data integrity
SELECT 'Test 5: Data Integrity Checks' as test_name;

-- Check for orphaned records in wards (should be 0)
SELECT 
    'Orphaned Wards' as check_name,
    COUNT(*) as orphaned_count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM wards w
LEFT JOIN districts d ON w.district_id = d.id
WHERE d.id IS NULL
UNION ALL

-- Check for orphaned properties (should be 0)
SELECT 
    'Orphaned Properties (District)' as check_name,
    COUNT(*) as orphaned_count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM properties p
LEFT JOIN districts d ON p.district_id = d.id
WHERE p.district_id IS NOT NULL AND d.id IS NULL
UNION ALL

-- Check for properties with invalid coordinates (should be 0)
SELECT 
    'Invalid Property Coordinates' as check_name,
    COUNT(*) as invalid_count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM properties
WHERE location IS NULL OR NOT ST_IsValid(location)
UNION ALL

-- Check for properties with negative prices (should be 0)
SELECT 
    'Negative Property Prices' as check_name,
    COUNT(*) as invalid_count,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM properties
WHERE price <= 0;

-- Test 6: Check PostGIS functionality
SELECT 'Test 6: PostGIS Functionality' as test_name;

-- Test spatial queries
SELECT 
    'PostGIS Extension' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM pg_extension
WHERE extname = 'postgis'
UNION ALL

-- Test coordinate system
SELECT 
    'SRID 4326 Support' as check_name,
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM spatial_ref_sys
WHERE srid = 4326
UNION ALL

-- Test spatial functions with sample data
SELECT 
    'Spatial Distance Calculation' as check_name,
    CASE WHEN AVG(distance_km) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM (
    SELECT ST_Distance(
        ST_Transform(p1.location, 3857),
        ST_Transform(p2.location, 3857)
    ) / 1000 as distance_km
    FROM properties p1, properties p2
    WHERE p1.id != p2.id
    LIMIT 10
) distances;

-- Test 7: Check Row-Level Security (RLS)
SELECT 'Test 7: Row-Level Security Status' as test_name;

SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN (
    'users', 'properties', 'valuations', 'user_favorites', 
    'estimation_logs', 'price_history', 'property_images', 'page_screenshots'
)
ORDER BY tablename;

-- Test 8: Check lookup data completeness
SELECT 'Test 8: Lookup Data Completeness' as test_name;

SELECT 
    'Property Types' as lookup_table,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) >= 15 THEN 'PASS' ELSE 'FAIL' END as status
FROM property_types
UNION ALL

SELECT 
    'Legal Statuses' as lookup_table,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) >= 5 THEN 'PASS' ELSE 'FAIL' END as status
FROM legal_statuses
UNION ALL

SELECT 
    'Directions' as lookup_table,
    COUNT(*) as record_count,
    CASE WHEN COUNT(*) >= 8 THEN 'PASS' ELSE 'FAIL' END as status
FROM directions;

-- Test 9: Check ML models and estimation functionality
SELECT 'Test 9: ML Models and Estimation' as test_name;

SELECT 
    'ML Models Total' as check_name,
    COUNT(*) as model_count,
    CASE WHEN COUNT(*) >= 3 THEN 'PASS' ELSE 'FAIL' END as status
FROM ml_models
UNION ALL

SELECT 
    'Active ML Models' as check_name,
    COUNT(*) as active_count,
    CASE WHEN COUNT(*) >= 1 THEN 'PASS' ELSE 'FAIL' END as status
FROM ml_models
WHERE is_active = true
UNION ALL

SELECT 
    'Estimation Logs' as check_name,
    COUNT(*) as log_count,
    CASE WHEN COUNT(*) >= 20 THEN 'PASS' ELSE 'FAIL' END as status
FROM estimation_logs;

-- Test 10: Check data relationships and joins
SELECT 'Test 10: Data Relationships and Joins' as test_name;

-- Test complex join query
SELECT 
    'Complex Join Query' as check_name,
    COUNT(*) as result_count,
    CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END as status
FROM properties p
JOIN districts d ON p.district_id = d.id
JOIN property_types pt ON p.property_type_id = pt.id
JOIN legal_statuses ls ON p.legal_status_id = ls.id
LEFT JOIN wards w ON p.ward_id = w.id
LEFT JOIN projects pr ON p.project_id = pr.id;

-- Test property with all related data
SELECT 
    p.title,
    pt.name as property_type,
    ls.name as legal_status,
    d.name as district,
    d.province,
    w.name as ward,
    pr.name as project,
    ST_X(p.location) as longitude,
    ST_Y(p.location) as latitude
FROM properties p
JOIN districts d ON p.district_id = d.id
JOIN property_types pt ON p.property_type_id = pt.id
JOIN legal_statuses ls ON p.legal_status_id = ls.id
LEFT JOIN wards w ON p.ward_id = w.id
LEFT JOIN projects pr ON p.project_id = pr.id
LIMIT 5;

-- Test 11: Performance and indexing
SELECT 'Test 11: Database Indexes' as test_name;

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('properties', 'districts', 'wards', 'users')
ORDER BY tablename, indexname;

-- Final summary
SELECT 'FINAL SUMMARY: Phase 1 Database Implementation Status' as summary;

SELECT 
    'Total Tables' as metric,
    COUNT(*) as value,
    '15+ expected' as requirement
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
UNION ALL

SELECT 
    'Total Districts' as metric,
    COUNT(*)::text as value,
    '50+ required' as requirement
FROM districts
UNION ALL

SELECT 
    'Total Wards' as metric,
    COUNT(*)::text as value,
    '200+ required' as requirement
FROM wards
UNION ALL

SELECT 
    'Total Properties' as metric,
    COUNT(*)::text as value,
    '50+ required' as requirement
FROM properties
UNION ALL

SELECT 
    'Total Users' as metric,
    COUNT(*)::text as value,
    '15+ required' as requirement
FROM users
UNION ALL

SELECT 
    'Total Projects' as metric,
    COUNT(*)::text as value,
    '10+ required' as requirement
FROM projects
UNION ALL

SELECT 
    'PostGIS Enabled' as metric,
    CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END as value,
    'Required' as requirement
FROM pg_extension
WHERE extname = 'postgis';