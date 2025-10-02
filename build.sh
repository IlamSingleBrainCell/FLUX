#!/bin/bash
set -e

echo "=== Starting FLUX Build ==="

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
  echo "ERROR: frontend directory not found!"
  ls -la
  exit 1
fi

echo "Frontend directory found, proceeding with build..."

# Navigate to frontend and build
cd frontend
echo "Installing dependencies..."
npm install
echo "Building Next.js application..."
npm run build

echo "=== Build Complete ==="
