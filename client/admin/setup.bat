@echo off
echo ========================================
echo   SAF Admin Portal - Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed: 
node --version
echo.

echo Installing dependencies...
echo This may take a few minutes...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   start.bat
echo.
echo Or manually run:
echo   npm run dev
echo.
pause



