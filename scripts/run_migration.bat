@echo off
echo Running database migration for address conversion fields...

REM Set database connection parameters
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=dinh_gia_bds
set DB_USER=postgres
set DB_PASSWORD=password

REM Run the migration
psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -f database/migration_add_address_conversion.sql

if %ERRORLEVEL% EQU 0 (
    echo Migration completed successfully!
) else (
    echo Migration failed with error code %ERRORLEVEL%
    pause
) 