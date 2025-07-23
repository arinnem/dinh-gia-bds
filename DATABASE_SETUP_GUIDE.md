# Database Setup Guide

## Prerequisites

This project requires PostgreSQL with PostGIS extension. Follow the steps below to set up the database.

## 1. Install PostgreSQL

### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure to install the PostGIS extension during installation

### Alternative - Using Docker:
```bash
# Run PostgreSQL with PostGIS in Docker
docker run --name postgres-gis \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=dinh_gia_bds \
  -p 5432:5432 \
  -d postgis/postgis:15-3.3
```

## 2. Update Database Configuration

The `.env` file has been created with default settings:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/dinh_gia_bds
```

Update the credentials in `.env` file to match your PostgreSQL installation:
- Replace `postgres` with your PostgreSQL username
- Replace `password` with your PostgreSQL password
- Replace `dinh_gia_bds` with your desired database name

## 3. Create Database and Run Schema

Once PostgreSQL is installed and running:

### Option A: Using psql command line
```bash
# Create the database
createdb dinh_gia_bds

# Run the schema
psql -d dinh_gia_bds -f database/schema.sql

# Populate with dummy data
psql -d dinh_gia_bds -f database/dummy_data.sql
```

### Option B: Using the Python setup script
```bash
# Update database credentials in database_setup.py first
python database_setup.py
```

### Option C: Using the setup and run script
```bash
python setup_and_run.py setup-db
```

## 4. Verify Database Setup

After running the schema and dummy data scripts, you should have:
- 20+ property types
- 20+ legal statuses
- 8 directions
- 24 districts
- Sample wards, users, projects, and properties

## 5. Test Database Connection

You can test the database connection by running:
```bash
psql -d dinh_gia_bds -c "SELECT COUNT(*) FROM properties;"
```

## Troubleshooting

### Common Issues:

1. **PostgreSQL not found**: Make sure PostgreSQL is installed and added to your PATH
2. **Connection refused**: Ensure PostgreSQL service is running
3. **PostGIS extension error**: Install PostGIS extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "postgis";
   ```
4. **Permission denied**: Make sure your user has proper database permissions

### Database Schema Overview:

The database includes these main tables:
- `property_types`: Types of properties (apartment, house, etc.)
- `legal_statuses`: Legal status options
- `directions`: Property facing directions
- `districts`: Administrative districts
- `wards`: Administrative wards
- `users`: System users
- `projects`: Real estate projects
- `properties`: Main property data
- `valuations`: Property valuations
- `price_history`: Historical price data

For more details, see `database/schema.sql` and `design/db_schema.md`.