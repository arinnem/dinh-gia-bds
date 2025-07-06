import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT # For creating database

# --- Database Connection Parameters (Replace with your actual details or use environment variables) ---
DB_CONFIG = {
    "user": "your_db_user",
    "password": "your_db_password",
    "host": "localhost",
    "port": "5432"
}
DB_NAME = "bank_valuation_mvp"

# --- DDL Statements (Copied from our plan) ---
DDL_STATEMENTS = """
CREATE TABLE IF NOT EXISTS Properties (
    property_id SERIAL PRIMARY KEY,
    address_full TEXT,
    address_city TEXT,
    address_district TEXT,
    address_ward TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    property_type TEXT,
    land_area_sqm NUMERIC,
    floor_area_sqm NUMERIC,
    num_storeys INTEGER,
    num_bedrooms INTEGER,
    num_bathrooms INTEGER,
    year_built INTEGER,
    description TEXT,
    listing_url TEXT UNIQUE,
    listing_price NUMERIC,
    listing_price_currency TEXT DEFAULT 'VND',
    data_source_listing TEXT,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS PropertyValuations (
    valuation_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL REFERENCES Properties(property_id) ON DELETE CASCADE,
    valuation_date DATE NOT NULL,
    avm_estimated_value NUMERIC,
    banker_adjusted_value NUMERIC NOT NULL,
    valuation_currency TEXT DEFAULT 'VND',
    valuation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS HistoricalSales (
    sale_id SERIAL PRIMARY KEY,
    address_full TEXT NOT NULL,
    address_city TEXT,
    address_district TEXT,
    address_ward TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    sale_date DATE NOT NULL,
    sale_price NUMERIC NOT NULL,
    sale_price_currency TEXT DEFAULT 'VND',
    property_type TEXT,
    land_area_sqm NUMERIC,
    floor_area_sqm NUMERIC,
    year_built INTEGER,
    data_source TEXT NOT NULL,
    source_details_url_or_ref TEXT,
    is_verified_by_banker BOOLEAN DEFAULT FALSE,
    banker_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS LegalInformation (
    legal_info_id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL UNIQUE REFERENCES Properties(property_id) ON DELETE CASCADE,
    zoning_classification TEXT,
    zoning_master_plan_ref TEXT,
    zoning_notes TEXT,
    zoning_data_source TEXT,
    zoning_source_url_or_ref TEXT,
    dispute_status_summary TEXT,
    dispute_details TEXT,
    dispute_data_source TEXT,
    dispute_source_url_or_ref TEXT,
    construction_permit_status TEXT,
    construction_permit_number TEXT,
    construction_permit_date DATE,
    permit_data_source TEXT,
    permit_source_url_or_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ZoningScrapedLinks (
    link_id SERIAL PRIMARY KEY,
    search_location_context TEXT,
    source_website TEXT NOT NULL,
    document_title_or_article_headline TEXT,
    document_url TEXT NOT NULL UNIQUE,
    snippet TEXT,
    retrieved_date DATE NOT NULL,
    keywords_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ValuationComps (
    valuation_comp_id SERIAL PRIMARY KEY,
    valuation_id INTEGER NOT NULL REFERENCES PropertyValuations(valuation_id) ON DELETE CASCADE,
    historical_sale_id INTEGER NOT NULL REFERENCES HistoricalSales(sale_id) ON DELETE CASCADE,
    is_auto_suggested BOOLEAN DEFAULT FALSE,
    selection_rationale TEXT,
    UNIQUE (valuation_id, historical_sale_id)
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_properties_timestamp
BEFORE UPDATE ON Properties
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE TRIGGER set_propertyvaluations_timestamp
BEFORE UPDATE ON PropertyValuations
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE TRIGGER set_historcalsales_timestamp
BEFORE UPDATE ON HistoricalSales
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE OR REPLACE TRIGGER set_legalinformation_timestamp
BEFORE UPDATE ON LegalInformation
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
"""

def create_database_if_not_exists():
    """Connects to the PostgreSQL server and creates the database if it doesn't exist."""
    conn = None
    try:
        # Connect to the default 'postgres' database or any existing database to create a new one
        conn = psycopg2.connect(**DB_CONFIG, dbname='postgres')
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()

        # Check if database exists
        cur.execute(sql.SQL("SELECT 1 FROM pg_database WHERE datname = %s"), [DB_NAME])
        exists = cur.fetchone()
        if not exists:
            cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))
            print(f"Database '{DB_NAME}' created successfully.")
        else:
            print(f"Database '{DB_NAME}' already exists.")

        cur.close()
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL or creating database: {e}")
    finally:
        if conn:
            conn.close()

def create_tables():
    """Connects to the specified database and creates tables using DDL statements."""
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG, dbname=DB_NAME)
        cur = conn.cursor()

        # Split DDL statements and execute them.
        # Note: psycopg2 typically executes one statement at a time unless it's in a function/procedure.
        # For simplicity here, we'll split by semicolon, but be cautious with complex DDLs
        # or those containing semicolons within string literals or comments if not handled properly.
        # A more robust way for complex DDLs might be to execute them from a .sql file via psql
        # or handle transactions carefully.

        # Remove CREATE OR REPLACE TRIGGER and use CREATE TRIGGER IF NOT EXISTS for idempotency if supported
        # For functions and triggers, CREATE OR REPLACE is generally fine.
        # For tables, CREATE TABLE IF NOT EXISTS is used.

        # For simplicity, executing the whole block. Psycopg2 can handle multi-statement strings
        # if they are valid SQL procedural blocks or if each statement is executed separately.
        # Let's try executing the whole block.
        cur.execute(DDL_STATEMENTS)

        conn.commit()
        print(f"Tables and functions/triggers created successfully in database '{DB_NAME}'.")
        cur.close()
    except psycopg2.Error as e:
        print(f"Error creating tables in database '{DB_NAME}': {e}")
        if conn:
            conn.rollback() # Rollback any changes if an error occurs
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting database setup...")
    # 1. Ensure the database exists (or create it)
    # Note: You might need superuser privileges or appropriate grants to create a database.
    # If running in a restricted environment, ensure the DB_NAME already exists.
    # For this script, we'll attempt to create it.
    create_database_if_not_exists()

    # 2. Create tables within the database
    create_tables()
    print("Database setup process finished.")

# --- How to run this script: ---
# 1. Make sure you have PostgreSQL installed and running.
# 2. Create a database user specified in DB_CONFIG (e.g., 'your_db_user') with a password.
#    This user will need privileges to create databases (if create_database_if_not_exists is used fully)
#    or at least connect to 'postgres' db, and then create tables in the target DB_NAME.
#    Example psql commands (run as postgres superuser):
#    CREATE USER your_db_user WITH PASSWORD 'your_db_password';
#    ALTER USER your_db_user CREATEDB; -- To allow database creation
#    -- Or, if DB_NAME is pre-created:
#    -- CREATE DATABASE bank_valuation_mvp;
#    -- GRANT ALL PRIVILEGES ON DATABASE bank_valuation_mvp TO your_db_user;
# 3. Install psycopg2: pip install psycopg2-binary
# 4. Update DB_CONFIG at the top of this script with your actual credentials.
# 5. Run the script: python database_setup.py
#
# Note on Idempotency:
# - CREATE TABLE IF NOT EXISTS makes table creation idempotent.
# - CREATE OR REPLACE FUNCTION/TRIGGER makes function/trigger creation idempotent.
# - Database creation checks for existence before attempting to create.
# This means you can run the script multiple times.
```
