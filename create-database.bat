@echo off
echo ========================================
echo FlexiSAF Admissions System
echo Database Setup Script
echo ========================================
echo.

echo Creating database "Admission_Db"...
echo.

psql -U postgres -c "CREATE DATABASE \"Admission_Db\";"

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database created successfully.
    echo ========================================
    echo.
    echo Database name: Admission_Db
    echo Username: postgres
    echo Password: root
    echo.
    echo You can now start the Spring Boot application.
    echo It will automatically create the tables.
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to create database.
    echo ========================================
    echo.
    echo Please make sure:
    echo 1. PostgreSQL is running
    echo 2. You have the correct password for postgres user
    echo 3. psql is in your PATH
    echo.
    echo Try running this manually:
    echo psql -U postgres -c "CREATE DATABASE \"Admission_Db\";"
    echo.
)

pause
