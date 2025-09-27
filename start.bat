@echo off
echo Starting Hospital Management System...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking if MongoDB is running...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB might not be installed or not in PATH.
    echo Please make sure MongoDB is running on your system.
    echo.
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\fontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Starting the application...
echo.
echo Backend will start on http://localhost:5000
echo Frontend will start on http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd fontend && npm start"

echo.
echo Application started successfully!
echo.
echo Open your browser and go to http://localhost:3000
echo.
pause
