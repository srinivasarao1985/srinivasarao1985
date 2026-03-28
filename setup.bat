@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo Matrimonial Website - Setup Script (Windows)
echo ===================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

:: Backend setup
echo Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file from .env.example
    copy .env.example .env
    echo Please update backend\.env with your credentials
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Successfully installed backend dependencies
cd ..
echo.

:: Frontend setup
echo Setting up Frontend...
cd frontend

if not exist .env (
    echo Creating .env file from .env.example
    copy .env.example .env
    echo Please update frontend\.env with your credentials
)

echo Installing frontend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Successfully installed frontend dependencies
cd ..
echo.

echo ===================================================
echo Setup Complete!
echo ===================================================
echo.
echo Next Steps:
echo 1. Update backend\.env with your credentials
echo 2. Update frontend\.env with your API URL
echo.
echo To run the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo Frontend will open at: http://localhost:3000
echo Backend will run at: http://localhost:5000
echo.
pause
