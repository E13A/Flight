@echo off
echo ========================================
echo Deploying Smart Contracts
echo ========================================
echo.

cd /d "%~dp0smart contracts and etls"

echo Make sure the blockchain node is running first!
echo (Run start_blockchain.bat in another terminal)
echo.
timeout /t 3 /nobreak >nul

echo Deploying contracts to localhost...
npx hardhat run scripts\deploy.js --network localhost

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo Make sure Hardhat node is running.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Deployment Complete!
echo ========================================
echo.
echo Contract addresses saved to:
echo   smart contracts and etls\deployed_addresses.json
echo.
echo You can now use the contracts!
echo.
pause
