@echo off
echo ========================================
echo  FlightGuard DApp - Automated Setup
echo ========================================
echo.
echo This script will install all dependencies automatically.
echo Please ensure you have the following installed:
echo  - Node.js (v18 or higher)
echo  - Python (v3.10 or higher)
echo  - Git
echo.
pause

REM Check Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check Python
echo [2/7] Checking Python...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Python not found!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)
echo ✓ Python found

REM Install Frontend Dependencies
echo.
echo [3/7] Installing Frontend Dependencies...
cd frontend
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed
cd ..

REM Install Hardhat Dependencies
echo.
echo [4/7] Installing Hardhat Dependencies...
cd "smart contracts and etls"
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Hardhat installation failed!
    pause
    exit /b 1
)
echo ✓ Hardhat dependencies installed
cd ..

REM Create Python Virtual Environment
echo.
echo [5/7] Creating Python Virtual Environment...
cd backend
python -m venv venv
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create virtual environment!
    pause
    exit /b 1
)
echo ✓ Virtual environment created

REM Install Python Dependencies
echo.
echo [6/7] Installing Python Dependencies...
call venv\Scripts\activate
pip install -r requirements.txt
if %ERRORLEVEL% neq 0 (
    echo ERROR: Python dependency installation failed!
    pause
    exit /b 1
)
echo ✓ Python dependencies installed
cd ..

REM Create necessary folders
echo.
echo [7/7] Creating necessary directories...
if not exist "security\logs" mkdir "security\logs"
if not exist "backend\logs" mkdir "backend\logs"
echo ✓ Directories created

echo.
echo ========================================
echo  ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo  1. Review SETUP.md for configuration
echo  2. Run: start_blockchain_full.bat
echo.
echo The application will:
echo  - Start Hardhat blockchain
echo  - Deploy smart contracts
echo  - Register demo flight
echo  - Fund insurance pool
echo  - Start backend and frontend servers
echo.
echo Press any key to exit...
pause >nul
