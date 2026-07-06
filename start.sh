#!/bin/bash

# Hybrid PQC Key Exchange - Quick Start Script
# For Linux/macOS users

echo ""
echo "========================================"
echo "  Hybrid PQC Key Exchange - Startup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Or use your package manager:"
    echo "  Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  macOS (Homebrew): brew install node"
    echo ""
    exit 1
fi

echo "[OK] Node.js is installed"
node --version

echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "  Starting Server..."
echo "========================================"
echo ""
echo "Opening http://localhost:3000 in browser..."

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &
fi

sleep 2
echo ""
npm start
