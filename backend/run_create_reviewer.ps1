# Run this script to create a reviewer account in the database
# Make sure PostgreSQL is running

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Creating Reviewer Account" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Database connection details
$pgHost = "localhost"
$pgPort = "5432"
$pgDatabase = "Admission_Db"
$pgUser = "postgres"
$pgPassword = "root"

# Set password environment variable
$env:PGPASSWORD = $pgPassword

# Path to psql (adjust if needed)
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Check if psql exists
if (-not (Test-Path $psqlPath)) {
    Write-Host "ERROR: PostgreSQL psql not found at: $psqlPath" -ForegroundColor Red
    Write-Host "Please update the script with the correct path to psql.exe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common locations:" -ForegroundColor Yellow
    Write-Host "  C:\Program Files\PostgreSQL\17\bin\psql.exe" -ForegroundColor Gray
    Write-Host "  C:\Program Files\PostgreSQL\16\bin\psql.exe" -ForegroundColor Gray
    Write-Host "  C:\Program Files\PostgreSQL\15\bin\psql.exe" -ForegroundColor Gray
    exit 1
}

Write-Host "Connecting to database..." -ForegroundColor Yellow

# Execute the SQL file
& $psqlPath -h $pgHost -p $pgPort -U $pgUser -d $pgDatabase -f "create_reviewer_db.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Reviewer account created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Cyan
    Write-Host "  Email: reviewer@flexisaf.com" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now login to the reviewer dashboard!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to create reviewer account" -ForegroundColor Red
    Write-Host "Please check the error messages above" -ForegroundColor Yellow
}

Write-Host ""
