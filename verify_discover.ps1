$response = Invoke-RestMethod -Uri "http://localhost:3002/api/discover" -Method Get
if ($response.exists -eq $true) {
    Write-Host "SUCCESS: Survey exists." -ForegroundColor Green
    Write-Host "Data: $($response.radarData | ConvertTo-Json -Depth 2)"
} else {
    Write-Host "FAIL: Survey not found." -ForegroundColor Red
}
