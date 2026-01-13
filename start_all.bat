@echo off
echo ========================================
echo Starting FlightGuard Full Stack
echo ========================================
echo.
echo Choose startup mode:
echo   1. Backend + Frontend only (default)
echo   2. Backend + Frontend + Blockchain
echo.
choice /C 12 /N /T 10 /D 1 /M "Enter choice (1 or 2, default=1 in 10s): "
set CHOICE=%ERRORLEVEL%

if %CHOICE%==2 (
    echo.
    echo Starting with blockchain...
    echo This will open 3 terminal windows:
    echo   1. Hardhat Blockchain (localhost:8545)
    echo   2. Backend (localhost:8000)
    echo   3. Frontend (localhost:3000)
    echo.
    
    REM Start blockchain
    start "FlightGuard Blockchain" cmd /k "%~dp0start_blockchain.bat"
    
    echo Waiting for blockchain to start...
    timeout /t 10 /nobreak >nul
    
    REM Deploy contracts
    echo Deploying contracts...
    cd /d "%~dp0smart contracts and etls"
    call npx hardhat run scripts\deploy.js --network localhost
    cd /d "%~dp0"
) else (
    echo.
    echo Starting without blockchain...
    echo This will open 2 terminal windows:
    echo   1. Backend (localhost:8000)
    echo   2. Frontend (localhost:3000)
    echo.
)

REM Start backend in new window
start "FlightGuard Backend" cmd /k "%~dp0start_backend.bat"

REM Wait 5 seconds for backend to initialize
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend in new window
start "FlightGuard Frontend" cmd /k "%~dp0start_frontend.bat"

echo.
echo ========================================
echo Both services are starting!
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Close this window or press Ctrl+C
echo ========================================
echo.

REM Keep this window open to show status
pause
