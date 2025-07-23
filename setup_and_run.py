#!/usr/bin/env python3
"""
Setup and Run Script for Real Estate Analysis Platform

This script helps set up the development environment and run the first backend feature.
It handles database setup, dependency installation guidance, and provides easy commands
to test the property management functionality.

Usage:
    python setup_and_run.py --help
    python setup_and_run.py setup-db
    python setup_and_run.py run-server
    python setup_and_run.py demo
"""

import argparse
import asyncio
import subprocess
import sys
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def check_postgresql():
    """Check if PostgreSQL is available"""
    try:
        result = subprocess.run(['psql', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ PostgreSQL found: {result.stdout.strip()}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ PostgreSQL not found or not in PATH")
    print("Please install PostgreSQL and make sure 'psql' command is available")
    return False

def install_dependencies():
    """Install Python dependencies"""
    print("Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    except FileNotFoundError:
        print("❌ requirements.txt not found")
        return False

def setup_database():
    """Set up the database using database_setup.py"""
    print("Setting up database...")
    print("\n⚠️  IMPORTANT: Please update database credentials in the following files:")
    print("   - database_setup.py (DB_CONFIG section)")
    print("   - app/core/config.py (DATABASE_URL)")
    print("   - Or create a .env file with DATABASE_URL")
    
    response = input("\nHave you updated the database credentials? (y/n): ")
    if response.lower() != 'y':
        print("Please update the database credentials first, then run this command again.")
        return False
    
    try:
        subprocess.run([sys.executable, 'database_setup.py'], check=True)
        print("✅ Database setup completed")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Database setup failed: {e}")
        print("\nTroubleshooting tips:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check database credentials in database_setup.py")
        print("3. Ensure the database user has CREATE DATABASE privileges")
        return False
    except FileNotFoundError:
        print("❌ database_setup.py not found")
        return False

def run_server():
    """Run the FastAPI server"""
    print("Starting FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation will be available at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        subprocess.run([sys.executable, '-m', 'uvicorn', 'app.main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'])
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
    except FileNotFoundError:
        print("❌ uvicorn not found. Make sure dependencies are installed.")
        print("Run: python setup_and_run.py install-deps")

def run_demo():
    """Run the CLI demo"""
    print("Running Property Management CLI Demo...")
    print("\nThis demo will:")
    print("1. Create sample property data")
    print("2. Demonstrate property search functionality")
    print("3. Show property details retrieval")
    
    response = input("\nContinue with demo? (y/n): ")
    if response.lower() != 'y':
        return
    
    try:
        # Create sample data
        print("\n" + "="*50)
        print("STEP 1: Creating sample data")
        print("="*50)
        subprocess.run([sys.executable, 'cli_demo.py', 'create-sample-data'], check=True)
        
        # List all properties
        print("\n" + "="*50)
        print("STEP 2: Listing all properties")
        print("="*50)
        subprocess.run([sys.executable, 'cli_demo.py', 'list-all', '--limit', '5'], check=True)
        
        # Search by city
        print("\n" + "="*50)
        print("STEP 3: Searching properties by city")
        print("="*50)
        subprocess.run([sys.executable, 'cli_demo.py', 'search', '--city', 'Ho Chi Minh City', '--limit', '3'], check=True)
        
        # Search by property type
        print("\n" + "="*50)
        print("STEP 4: Searching properties by type")
        print("="*50)
        subprocess.run([sys.executable, 'cli_demo.py', 'search', '--property-type', 'HOUSE'], check=True)
        
        # Get specific property
        print("\n" + "="*50)
        print("STEP 5: Getting detailed property information")
        print("="*50)
        subprocess.run([sys.executable, 'cli_demo.py', 'get-property', '--id', '1'], check=True)
        
        print("\n" + "="*50)
        print("DEMO COMPLETED SUCCESSFULLY!")
        print("="*50)
        print("\nYou can now:")
        print("- Run the FastAPI server: python setup_and_run.py run-server")
        print("- Use the CLI tool: python cli_demo.py --help")
        print("- Access API docs at: http://localhost:8000/docs (when server is running)")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Demo failed: {e}")
        print("\nMake sure the database is set up and running.")
        print("Run: python setup_and_run.py setup-db")
    except FileNotFoundError:
        print("❌ cli_demo.py not found")

def main():
    parser = argparse.ArgumentParser(description="Setup and run Real Estate Analysis Platform")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # Setup commands
    subparsers.add_parser("check-requirements", help="Check system requirements")
    subparsers.add_parser("install-deps", help="Install Python dependencies")
    subparsers.add_parser("setup-db", help="Set up the database")
    subparsers.add_parser("run-server", help="Run the FastAPI server")
    subparsers.add_parser("demo", help="Run the CLI demo")
    subparsers.add_parser("full-setup", help="Run complete setup (check requirements, install deps, setup db)")
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        print("\n" + "="*60)
        print("QUICK START GUIDE")
        print("="*60)
        print("1. Check requirements:    python setup_and_run.py check-requirements")
        print("2. Install dependencies:  python setup_and_run.py install-deps")
        print("3. Setup database:        python setup_and_run.py setup-db")
        print("4. Run demo:              python setup_and_run.py demo")
        print("5. Run server:            python setup_and_run.py run-server")
        print("\nOr run everything at once: python setup_and_run.py full-setup")
        return
    
    print("Real Estate Analysis Platform - Setup & Run")
    print("=" * 50)
    
    if args.command == "check-requirements":
        print("Checking system requirements...")
        python_ok = check_python_version()
        postgres_ok = check_postgresql()
        
        if python_ok and postgres_ok:
            print("\n✅ All requirements met!")
        else:
            print("\n❌ Some requirements are missing. Please install them first.")
    
    elif args.command == "install-deps":
        install_dependencies()
    
    elif args.command == "setup-db":
        setup_database()
    
    elif args.command == "run-server":
        run_server()
    
    elif args.command == "demo":
        run_demo()
    
    elif args.command == "full-setup":
        print("Running full setup...")
        print("\nStep 1: Checking requirements")
        python_ok = check_python_version()
        postgres_ok = check_postgresql()
        
        if not (python_ok and postgres_ok):
            print("❌ Requirements not met. Please install missing components first.")
            return
        
        print("\nStep 2: Installing dependencies")
        if not install_dependencies():
            return
        
        print("\nStep 3: Setting up database")
        if not setup_database():
            return
        
        print("\n✅ Full setup completed successfully!")
        print("\nNext steps:")
        print("- Run demo: python setup_and_run.py demo")
        print("- Run server: python setup_and_run.py run-server")

if __name__ == "__main__":
    main()