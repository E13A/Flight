@echo off
echo ========================================
echo Starting FlightGuard Frontend
echo ========================================
echo.

cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    echo This may take a few minutes on first run...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo Please ensure Node.js 18+ is installed
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Frontend starting on http://localhost:3000
echo ========================================
echo.

REM Start development server
set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
