@echo off
REM FLUX CrewAI Backend Startup Script
REM This starts the CrewAI-powered backend server

echo.
echo ================================================================================
echo   FLUX CrewAI Backend - Starting...
echo ================================================================================
echo.

REM Check if in backend directory
if not exist "main_crewai.py" (
    echo ERROR: main_crewai.py not found!
    echo Please run this script from the backend directory
    pause
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo WARNING: .env file not found
    echo Creating from .env.example...
    if exist ".env.example" (
        copy .env.example .env
    ) else (
        echo ERROR: .env.example not found!
        echo Please create .env with your GROQ_API_KEY
        pause
        exit /b 1
    )
)

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python 3.9+ and add to PATH
    pause
    exit /b 1
)

echo Checking dependencies...
python -c "import crewai" >nul 2>&1
if errorlevel 1 (
    echo.
    echo CrewAI not installed! Installing dependencies...
    echo.
    pip install -r requirements_crewai.txt
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ================================================================================
echo   Starting FLUX CrewAI Server on http://localhost:8000
echo ================================================================================
echo.
echo   WebSocket: ws://localhost:8000/ws/{client_id}
echo   API Docs:  http://localhost:8000/docs
echo   Health:    http://localhost:8000/health
echo.
echo   Press Ctrl+C to stop
echo ================================================================================
echo.

python main_crewai.py
