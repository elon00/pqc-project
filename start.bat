@echo off
REM Hybrid PQC Key Exchange - Quick Start Script
REM This script will install dependencies and start the server

echo.
echo ========================================
echo   Hybrid PQC Key Exchange - Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then restart this script.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version

echo.
echo Installing dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Starting Server...
echo ========================================
echo.
echo Opening http://localhost:3000 in browser...
timeout /t 2 /nobreak
start http://localhost:3000

echo.
npm start

pause
