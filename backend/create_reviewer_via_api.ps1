# Create reviewer account via API endpoint
# This ensures the password is properly encoded using the application's BCrypt encoder

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Creating Reviewer Account" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$apiUrl = "http://localhost:8080/api/admin/create-reviewer"
$email = "reviewer@flexisaf.com"
$password = "admin123"

$body = @{
    email = $email
    password = $password
} | ConvertTo-Json

Write-Host "Calling API to create reviewer..." -ForegroundColor Yellow
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"

    Write-Host "================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host $response.message -ForegroundColor Green
    Write-Host ""
    Write-Host "Login Credentials:" -ForegroundColor Cyan
    Write-Host "  Email: $email" -ForegroundColor White
    Write-Host "  Password: $password" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now login to the reviewer dashboard!" -ForegroundColor Green

} catch {
    Write-Host "================================" -ForegroundColor Red
    Write-Host "ERROR" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Failed to create reviewer account" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Make sure the backend server is running on http://localhost:8080" -ForegroundColor Yellow
}

Write-Host ""
