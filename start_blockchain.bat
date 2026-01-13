@echo off
echo ========================================
echo Starting Hardhat Local Blockchain
echo ========================================
echo.

cd /d "%~dp0smart contracts and etls"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Hardhat dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Blockchain Node Details:
echo   RPC URL: http://127.0.0.1:8545
echo   Chain ID: 31337
echo   Network: Hardhat Local
echo ========================================
echo.
echo Starting node... (Keep this terminal open!)
echo Press Ctrl+C to stop the blockchain
echo.

REM Start Hardhat node
npx hardhat node
