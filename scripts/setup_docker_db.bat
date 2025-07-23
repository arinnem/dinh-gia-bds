@echo off
echo Setting up PostgreSQL database using Docker...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not running or not installed
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)

REM Stop and remove existing container if it exists
echo Stopping existing database container (if any)...
docker stop dinh-gia-bds-db >nul 2>&1
docker rm dinh-gia-bds-db >nul 2>&1

REM Create and start PostgreSQL container with PostGIS
echo Creating PostgreSQL container with PostGIS...
docker run --name dinh-gia-bds-db ^
    -e POSTGRES_PASSWORD=password ^
    -e POSTGRES_USER=postgres ^
    -e POSTGRES_DB=dinh_gia_bds ^
    -p 5432:5432 ^
    -d postgis/postgis:15-3.3

if %errorlevel% neq 0 (
    echo Error: Failed to create PostgreSQL container
    echo Please check Docker installation and try again
    pause
    exit /b 1
)

echo Waiting for PostgreSQL to start...
timeout /t 10 /nobreak >nul

REM Test database connection
echo Testing database connection...
docker exec dinh-gia-bds-db psql -U postgres -d dinh_gia_bds -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Database might still be starting up
    echo Waiting a bit more...
    timeout /t 5 /nobreak >nul
)

echo.
echo PostgreSQL container created successfully!
echo Container name: dinh-gia-bds-db
echo Database: dinh_gia_bds
echo User: postgres
echo Password: password
echo Port: 5432
echo.
echo You can now run the database setup script:
echo   scripts\setup_database.bat
echo.
echo To stop the database: docker stop dinh-gia-bds-db
echo To start the database: docker start dinh-gia-bds-db
echo To remove the database: docker rm dinh-gia-bds-db
echo.
pause