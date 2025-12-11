@echo off
echo ========================================
echo FlexiSAF Database Cleanup Script
echo ========================================
echo.
echo This will clean up empty applicant records from the production database.
echo.

REM Set password as environment variable
set PGPASSWORD=AKlpO5WuD1WkYfIoKf90nzoWMizsd62n

echo Connecting to database and running cleanup...
echo.

psql -h dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com -U flexisaf_admission_db_user -d flexisaf_admission_db -f fix-production-database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database cleanup completed.
    echo ========================================
    echo.
    echo You can now:
    echo 1. Login as admin with: admin@flexisaf.com / admin123
    echo 2. Register new students - they will see the application form
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database cleanup failed
    echo ========================================
    echo.
    echo Make sure PostgreSQL client is installed.
    echo Download from: https://www.postgresql.org/download/windows/
    echo.
)

REM Clear password from environment
set PGPASSWORD=

pause
