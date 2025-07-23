#!/usr/bin/env python3
"""
Database Setup Script
This script creates the database schema and populates it with dummy data.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'password'),
    'database': os.getenv('DB_NAME', 'dinh_gia_bds')
}

def create_database_if_not_exists():
    """Create database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server (not to a specific database)
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database='postgres'  # Connect to default postgres database
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (DB_CONFIG['database'],))
        exists = cursor.fetchone()
        
        if not exists:
            logger.info(f"Creating database '{DB_CONFIG['database']}'...")
            cursor.execute(f"CREATE DATABASE {DB_CONFIG['database']}")
            logger.info(f"Database '{DB_CONFIG['database']}' created successfully.")
        else:
            logger.info(f"Database '{DB_CONFIG['database']}' already exists.")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        logger.error(f"Error creating database: {e}")
        sys.exit(1)

def execute_sql_file(file_path):
    """Execute SQL commands from a file"""
    try:
        # Connect to the target database
        conn = psycopg2.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open(file_path, 'r', encoding='utf-8') as file:
            sql_content = file.read()
            
        logger.info(f"Executing SQL file: {file_path}")
        cursor.execute(sql_content)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        logger.info(f"Successfully executed: {file_path}")
        
    except Exception as e:
        logger.error(f"Error executing {file_path}: {e}")
        sys.exit(1)

def main():
    """Main function to setup database"""
    logger.info("Starting database setup...")
    
    # Get script directory
    script_dir = Path(__file__).parent.parent
    schema_file = script_dir / 'database' / 'schema.sql'
    dummy_data_file = script_dir / 'database' / 'dummy_data.sql'
    
    # Check if SQL files exist
    if not schema_file.exists():
        logger.error(f"Schema file not found: {schema_file}")
        sys.exit(1)
        
    if not dummy_data_file.exists():
        logger.error(f"Dummy data file not found: {dummy_data_file}")
        sys.exit(1)
    
    # Create database if it doesn't exist
    create_database_if_not_exists()
    
    # Execute schema file
    execute_sql_file(schema_file)
    
    # Execute dummy data file
    execute_sql_file(dummy_data_file)
    
    logger.info("Database setup completed successfully!")
    logger.info(f"Database: {DB_CONFIG['database']}")
    logger.info(f"Host: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
    logger.info(f"User: {DB_CONFIG['user']}")

if __name__ == '__main__':
    main()