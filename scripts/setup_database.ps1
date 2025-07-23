# Database Setup PowerShell Script
# This script creates the database schema and populates it with dummy data

Write-Host "Setting up database schema and dummy data..." -ForegroundColor Green
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python and try again" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if psycopg2 is installed
try {
    python -c "import psycopg2" 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Installing psycopg2..." -ForegroundColor Yellow
        pip install psycopg2-binary
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to install psycopg2" -ForegroundColor Red
            Write-Host "Please install it manually: pip install psycopg2-binary" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 1
        }
    }
} catch {
    Write-Host "Installing psycopg2..." -ForegroundColor Yellow
    pip install psycopg2-binary
}

# Set default environment variables if not set
if (-not $env:DB_HOST) { $env:DB_HOST = "localhost" }
if (-not $env:DB_PORT) { $env:DB_PORT = "5432" }
if (-not $env:DB_USER) { $env:DB_USER = "postgres" }
if (-not $env:DB_PASSWORD) { $env:DB_PASSWORD = "password" }
if (-not $env:DB_NAME) { $env:DB_NAME = "dinh_gia_bds" }

Write-Host "Database Configuration:" -ForegroundColor Cyan
Write-Host "Host: $env:DB_HOST" -ForegroundColor White
Write-Host "Port: $env:DB_PORT" -ForegroundColor White
Write-Host "User: $env:DB_USER" -ForegroundColor White
Write-Host "Database: $env:DB_NAME" -ForegroundColor White
Write-Host ""

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$setupScript = Join-Path $scriptDir "setup_database.py"

# Run the Python setup script
try {
    python $setupScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host "" 
        Write-Host "Database setup completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "" 
        Write-Host "Database setup failed. Please check the error messages above." -ForegroundColor Red
    }
} catch {
    Write-Host "Error running setup script: $_" -ForegroundColor Red
}

Read-Host "Press Enter to exit"