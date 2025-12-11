# FlexiSAF Database Cleanup via API
# Run this after deploying the updated code

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FlexiSAF Database Cleanup via API" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "https://flexisaf-admission-api-backend.onrender.com/api/admin/cleanup-empty-applicants"

Write-Host "Calling cleanup endpoint..." -ForegroundColor Yellow
Write-Host "URL: $apiUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -ContentType "application/json"

    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Deleted Records: $($response.deletedCount)" -ForegroundColor White
    Write-Host "Remaining Applicants: $($response.remainingApplicants)" -ForegroundColor White
    Write-Host "Total Users: $($response.totalUsers)" -ForegroundColor White
    Write-Host ""
    Write-Host "Message: $($response.message)" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Cyan
    Write-Host "1. Login as admin with: admin@flexisaf.com / admin123" -ForegroundColor White
    Write-Host "2. Register new students - they will see the application form" -ForegroundColor White

} catch {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error message: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure the backend is deployed with the latest changes." -ForegroundColor Yellow
}

Write-Host ""
pause
