#!/bin/bash

echo "Starting Hospital Management System..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js version: $(node --version)"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB might not be installed or not in PATH."
    echo "Please make sure MongoDB is running on your system."
    echo
fi

echo
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd ../fontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Starting the application..."
echo
echo "Backend will start on http://localhost:5000"
echo "Frontend will start on http://localhost:3000"
echo
echo "Press Ctrl+C to stop the application"
echo

# Start backend in background
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
cd ../fontend
npm start &
FRONTEND_PID=$!

echo
echo "Application started successfully!"
echo
echo "Open your browser and go to http://localhost:3000"
echo
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "Press Ctrl+C to stop the application"

# Function to cleanup processes on exit
cleanup() {
    echo
    echo "Stopping application..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Application stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
