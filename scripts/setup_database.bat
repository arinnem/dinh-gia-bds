@echo off
echo Setting up database schema and dummy data...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python and try again
    pause
    exit /b 1
)

REM Check if psycopg2 is installed
python -c "import psycopg2" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing psycopg2...
    pip install psycopg2-binary
    if %errorlevel% neq 0 (
        echo Error: Failed to install psycopg2
        echo Please install it manually: pip install psycopg2-binary
        pause
        exit /b 1
    )
)

REM Set default environment variables if not set
if not defined DB_HOST set DB_HOST=localhost
if not defined DB_PORT set DB_PORT=5432
if not defined DB_USER set DB_USER=postgres
if not defined DB_PASSWORD set DB_PASSWORD=password
if not defined DB_NAME set DB_NAME=dinh_gia_bds

echo Database Configuration:
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo User: %DB_USER%
echo Database: %DB_NAME%
echo.

REM Run the Python setup script
python "%~dp0setup_database.py"

if %errorlevel% equ 0 (
    echo.
    echo Database setup completed successfully!
) else (
    echo.
    echo Database setup failed. Please check the error messages above.
)

pause