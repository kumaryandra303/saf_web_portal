@echo off
echo ========================================
echo   SAF Admin Portal - Starting...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Dependencies not found!
    echo Running setup first...
    echo.
    call setup.bat
)

echo Starting development server...
echo.
echo The admin portal will open at:
echo http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

