# PowerShell script to run the cleanup SQL script
# This will remove all sample data from the database

$sqlFile = "C:\Users\lenovo\Documents\DevFlux\FlexiSAF Admission API\backend\cleanup_sample_data.sql"
$dbName = "flexisaf_admissions"
$dbUser = "postgres"

# Read the password from user or environment
Write-Host "Running database cleanup to remove sample data..." -ForegroundColor Yellow
Write-Host ""

# Try to find psql in common PostgreSQL installation paths
$psqlPaths = @(
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe"
)

$psqlExe = $null
foreach ($path in $psqlPaths) {
    if (Test-Path $path) {
        $psqlExe = $path
        break
    }
}

if ($psqlExe -eq $null) {
    Write-Host "ERROR: Could not find psql.exe. Please run the SQL script manually:" -ForegroundColor Red
    Write-Host "1. Open pgAdmin or your PostgreSQL client" -ForegroundColor Yellow
    Write-Host "2. Connect to the 'flexisaf_admissions' database" -ForegroundColor Yellow
    Write-Host "3. Run the script: $sqlFile" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or specify the path to psql.exe and run:" -ForegroundColor Yellow
    Write-Host "psql -U postgres -d flexisaf_admissions -f ""$sqlFile""" -ForegroundColor Cyan
    exit 1
}

Write-Host "Found PostgreSQL at: $psqlExe" -ForegroundColor Green
Write-Host ""
Write-Host "Executing cleanup script..." -ForegroundColor Yellow

# Execute the SQL file
& $psqlExe -U $dbUser -d $dbName -f $sqlFile

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Sample data has been removed from the database." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Restart your backend server to complete the cleanup." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: Failed to execute cleanup script. Error code: $LASTEXITCODE" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the SQL script manually using pgAdmin or your PostgreSQL client." -ForegroundColor Yellow
}
