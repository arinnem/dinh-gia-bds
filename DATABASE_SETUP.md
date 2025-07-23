# Database Setup Guide

This guide will help you set up the PostgreSQL database for the Real Estate Valuation Platform.

## Prerequisites

### 1. Install PostgreSQL

#### Windows:
1. Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure to install the PostGIS extension when prompted
5. Add PostgreSQL bin directory to your PATH (usually `C:\Program Files\PostgreSQL\15\bin`)

#### Alternative: Using Docker
```bash
# Pull PostgreSQL with PostGIS
docker pull postgis/postgis:15-3.3

# Run PostgreSQL container
docker run --name dinh-gia-bds-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=dinh_gia_bds -p 5432:5432 -d postgis/postgis:15-3.3
```

### 2. Install Python Dependencies
```bash
pip install psycopg2-binary
```

## Database Configuration

The database setup scripts use the following environment variables (with defaults):

- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)
- `DB_USER`: Database user (default: `postgres`)
- `DB_PASSWORD`: Database password (default: `password`)
- `DB_NAME`: Database name (default: `dinh_gia_bds`)

### Setting Environment Variables

#### Windows Command Prompt:
```cmd
set DB_HOST=localhost
set DB_PORT=5432
set DB_USER=postgres
set DB_PASSWORD=your_password
set DB_NAME=dinh_gia_bds
```

#### Windows PowerShell:
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="5432"
$env:DB_USER="postgres"
$env:DB_PASSWORD="your_password"
$env:DB_NAME="dinh_gia_bds"
```

## Running the Database Setup

Once PostgreSQL is installed and running, you can set up the database using one of the following methods:

### Method 1: Python Script
```bash
python scripts/setup_database.py
```

### Method 2: Windows Batch File
```cmd
scripts\setup_database.bat
```

### Method 3: PowerShell Script
```powershell
.\scripts\setup_database.ps1
```

### Method 4: Manual Setup
If the automated scripts don't work, you can manually run the SQL files:

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Create database
CREATE DATABASE dinh_gia_bds;

# Connect to the new database
\c dinh_gia_bds

# Run schema file
\i database/schema.sql

# Run dummy data file
\i database/dummy_data.sql
```

## Database Schema Overview

The database includes the following main tables:

- **property_types**: Property type definitions (apartment, house, etc.)
- **legal_statuses**: Legal status definitions (red book, pink book, etc.)
- **directions**: Direction definitions (North, South, etc.)
- **districts**: District information for Ho Chi Minh City
- **wards**: Ward information for districts
- **users**: User accounts and profiles
- **projects**: Real estate project information
- **properties**: Main property data
- **price_history**: Historical price data
- **property_images**: Property image storage
- **page_screenshots**: Screenshots from web scraping
- **valuations**: Property valuation results
- **user_favorites**: User favorite properties
- **ml_models**: Machine learning model configurations
- **estimation_logs**: Valuation estimation logs

## Troubleshooting

### PostgreSQL Service Not Running

#### Windows:
1. Open Services (services.msc)
2. Find "postgresql-x64-15" (or similar)
3. Right-click and select "Start"

#### Command Line:
```cmd
# Start PostgreSQL service
net start postgresql-x64-15

# Stop PostgreSQL service
net stop postgresql-x64-15
```

### Connection Issues

1. **Check if PostgreSQL is running**:
   ```bash
   psql -U postgres -h localhost -c "SELECT version();"
   ```

2. **Check PostgreSQL configuration**:
   - Ensure `postgresql.conf` has `listen_addresses = '*'` or `'localhost'`
   - Ensure `pg_hba.conf` allows connections from your IP

3. **Firewall issues**:
   - Make sure port 5432 is not blocked by firewall

### PostGIS Extension

If you get PostGIS-related errors:

```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

## Verification

After successful setup, you can verify the database:

```sql
-- Connect to database
psql -U postgres -d dinh_gia_bds

-- Check tables
\dt

-- Check sample data
SELECT COUNT(*) FROM properties;
SELECT COUNT(*) FROM districts;
SELECT COUNT(*) FROM users;
```

You should see:
- Multiple tables created
- Sample data in various tables
- At least 20 records in most lookup tables

## Next Steps

After database setup:

1. Update your application's database connection settings
2. Run the application: `npm run dev`
3. Test the database connectivity through the application
4. Check that all features work correctly