# FlexiSAF Database Cleanup Script (PowerShell)
# This script uses the API to clean up the database without needing PostgreSQL client

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FlexiSAF Database Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Database credentials
$dbHost = "dpg-d4sl2pfgi27c73bp47h0-a.virginia-postgres.render.com"
$dbName = "flexisaf_admission_db"
$dbUser = "flexisaf_admission_db_user"
$dbPassword = "AKlpO5WuD1WkYfIoKf90nzoWMizsd62n"

# SQL to execute
$sql = @"
DELETE FROM applicants WHERE (gpa IS NULL OR gpa = 0 OR gpa = 0.0) AND (test_score IS NULL OR test_score = 0) AND (program IS NULL OR program = '' OR TRIM(program) = '');
SELECT COUNT(*) as total_applicants_remaining FROM applicants;
SELECT COUNT(*) as total_users FROM users;
SELECT email, role FROM users WHERE role IN ('REVIEWER', 'ADMIN');
"@

Write-Host "Connecting to database: $dbName" -ForegroundColor Yellow
Write-Host "Host: $dbHost" -ForegroundColor Yellow
Write-Host ""

# Connection string
$connectionString = "Host=$dbHost;Database=$dbName;Username=$dbUser;Password=$dbPassword;SSL Mode=Require;"

Write-Host "Executing cleanup SQL..." -ForegroundColor Yellow
Write-Host ""

# Try to use Npgsql if available, otherwise show manual instructions
try {
    # Check if we can load Npgsql
    Add-Type -Path "Npgsql.dll" -ErrorAction Stop

    $conn = New-Object Npgsql.NpgsqlConnection($connectionString)
    $conn.Open()

    $cmd = $conn.CreateCommand()
    $cmd.CommandText = $sql
    $reader = $cmd.ExecuteReader()

    while ($reader.Read()) {
        Write-Host $reader[0]
    }

    $conn.Close()

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Database cleanup completed." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green

} catch {
    Write-Host "PostgreSQL client not available. Using alternative method..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run ONE of these options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "OPTION 1: Download and install PostgreSQL from:" -ForegroundColor White
    Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Green
    Write-Host "Then run: run-database-fix.bat" -ForegroundColor Green
    Write-Host ""
    Write-Host "OPTION 2: Use Render Dashboard (Web UI):" -ForegroundColor White
    Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor Gray
    Write-Host "2. Click on 'flexisaf_admission_db'" -ForegroundColor Gray
    Write-Host "3. Click 'Connect' button (top right)" -ForegroundColor Gray
    Write-Host "4. Click 'External Connection' tab" -ForegroundColor Gray
    Write-Host "5. Copy the PSQL command and run in any terminal" -ForegroundColor Gray
    Write-Host "6. Paste contents of fix-production-database.sql" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Admin Login Credentials:" -ForegroundColor Cyan
Write-Host "Email: admin@flexisaf.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
Write-Host ""

pause
