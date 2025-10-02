# FLUX Environment Setup Script
# Run this script to set up your local development environment

Write-Host "`n=== FLUX Environment Setup ===" -ForegroundColor Cyan
Write-Host "This script will help you set up environment variables for local development`n" -ForegroundColor White

# Check if backend .env exists
if (!(Test-Path "backend\.env")) {
    Write-Host "[1/3] Creating backend/.env file..." -ForegroundColor Yellow
    @"
# Backend Environment Variables
# Get your Groq API key from https://console.groq.com

GROQ_API_KEY=your_groq_api_key_here
PORT=8000
ENVIRONMENT=development
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "      Created! Please edit backend/.env and add your actual GROQ_API_KEY" -ForegroundColor Green
} else {
    Write-Host "[1/3] backend/.env already exists" -ForegroundColor Green
}

# Check if frontend .env.local exists
if (!(Test-Path "frontend\.env.local")) {
    Write-Host "[2/3] Creating frontend/.env.local file..." -ForegroundColor Yellow
    @"
# Local Development Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NODE_ENV=development
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "      Created!" -ForegroundColor Green
} else {
    Write-Host "[2/3] frontend/.env.local already exists" -ForegroundColor Green
}

Write-Host "[3/3] Checking configuration..." -ForegroundColor Yellow

# Check if GROQ_API_KEY is set
$envContent = Get-Content "backend\.env" -Raw
if ($envContent -match "GROQ_API_KEY=your_groq_api_key_here") {
    Write-Host "`n      ACTION REQUIRED:" -ForegroundColor Red
    Write-Host "      1. Get your Groq API key from: https://console.groq.com" -ForegroundColor White
    Write-Host "      2. Edit backend/.env and replace 'your_groq_api_key_here' with your actual key" -ForegroundColor White
} else {
    Write-Host "      GROQ_API_KEY appears to be configured!" -ForegroundColor Green
}

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Start Backend:  cd backend && python main_minimal.py" -ForegroundColor White
Write-Host "2. Start Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "3. Open Browser:   http://localhost:3002" -ForegroundColor White
Write-Host "`nFor Vercel deployment, see ENV_SETUP_GUIDE.md`n" -ForegroundColor Cyan
