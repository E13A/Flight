@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  FlightGuard DApp - Full Setup
echo ========================================
echo.

REM Change to project root
cd /d "%~dp0"

echo [1/7] Starting Hardhat Blockchain...
echo ========================================
cd "smart contracts and etls"
start "Hardhat Blockchain" cmd /k "npx hardhat node"
cd ..
timeout /t 5 /nobreak > nul

echo.
echo [2/7] Deploying Smart Contracts...
echo ========================================
cd "smart contracts and etls"
call npx hardhat run scripts\deploy.js --network localhost
if %ERRORLEVEL% neq 0 (
    echo ERROR: Contract deployment failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2.5/7] Activating Python Virtual Environment...
echo ========================================
cd backend
call venv\Scripts\activate
if %ERRORLEVEL% neq 0 (
    echo ERROR: Virtual environment not found!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo.
echo [3/7] Registering Demo Flight...
echo ========================================
call python register_demo_flight.py
if %ERRORLEVEL% neq 0 (
    echo ERROR: Flight registration failed!
    pause
    exit /b 1
)

echo.
echo [4/7] Funding Company Pool...
echo ========================================
call python fund_contract.py
if %ERRORLEVEL% neq 0 (
    echo ERROR: Company funding failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [5/7] Running Database Migrations...
echo ========================================
cd backend
call python manage.py migrate
if %ERRORLEVEL% neq 0 (
    echo ERROR: Migrations failed!
    pause
    exit /b 1
)

echo.
echo [5.5/7] Seeding Database with Demo Data...
echo ========================================
call python seed_database.py
cd ..

echo.
echo [6/7] Starting Backend Server...
echo ========================================
start "Backend Server" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn config.asgi:app --host 0.0.0.0 --port 8000 --reload"
timeout /t 3 /nobreak > nul

echo.
echo [7/7] Starting Frontend...
echo ========================================
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo  ✅ ALL SERVICES STARTED!
echo ========================================
echo.
echo  🔗 Blockchain:  http://127.0.0.1:8545
echo  🔧 Backend:     http://localhost:8000
echo  🌐 Frontend:    http://localhost:3000
echo.
echo  📝 To test oracle: cd backend ^&^& python oracle_simulator.py --flight-id [ID] --delay 240
echo.
echo Press any key to exit (services will keep running)...
pause > nul
