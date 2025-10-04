#!/bin/bash
# FLUX CrewAI Backend Startup Script (PowerShell)
# This starts the CrewAI-powered backend server

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  FLUX CrewAI Backend - Starting..." -ForegroundColor Cyan
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if in backend directory
if (!(Test-Path "main_crewai.py")) {
    Write-Host "ERROR: main_crewai.py not found!" -ForegroundColor Red
    Write-Host "Please run this script from the backend directory" -ForegroundColor Red
    pause
    exit 1
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "WARNING: .env file not found" -ForegroundColor Yellow
    Write-Host "Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item .env.example .env
    } else {
        Write-Host "ERROR: .env.example not found!" -ForegroundColor Red
        Write-Host "Please create .env with your GROQ_API_KEY" -ForegroundColor Red
        pause
        exit 1
    }
}

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.9+ and add to PATH" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Checking dependencies..." -ForegroundColor Yellow
try {
    python -c "import crewai" 2>&1 | Out-Null
    Write-Host "CrewAI dependencies OK" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "CrewAI not installed! Installing dependencies..." -ForegroundColor Yellow
    Write-Host ""
    pip install -r requirements_crewai.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
}

Write-Host ""
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host "  Starting FLUX CrewAI Server on http://localhost:8000" -ForegroundColor Green
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  WebSocket: ws://localhost:8000/ws/{client_id}" -ForegroundColor White
Write-Host "  API Docs:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "  Health:    http://localhost:8000/health" -ForegroundColor White
Write-Host ""
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host "================================================================================" -ForegroundColor Cyan
Write-Host ""

python main_crewai.py
