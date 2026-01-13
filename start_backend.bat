@echo off
echo ========================================
echo Starting FlightGuard Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Please ensure Python 3.11+ is installed
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies (this may take a few minutes on first run)...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!

REM Run migrations
echo Running database migrations...
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Database migration failed
    pause
    exit /b 1
)

REM Check for superuser
echo.
echo Checking for admin user...
python -c "from django.contrib.auth import get_user_model; User = get_user_model(); print('Admin exists' if User.objects.filter(is_superuser=True).exists() else 'No admin')" 2>nul
if errorlevel 1 (
    echo.
    echo No admin user found. Create one? (y/n)
    choice /C YN /N
    if errorlevel 2 goto skip_superuser
    if errorlevel 1 python manage.py createsuperuser
)
:skip_superuser

echo.
echo ========================================
echo Backend server starting on http://localhost:8000
echo GraphQL: http://localhost:8000/graphql
echo Admin: http://localhost:8000/admin
echo ========================================
echo.

REM Start server
uvicorn config.asgi:app --host 0.0.0.0 --port 8000 --reload
