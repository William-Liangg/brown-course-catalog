#!/bin/bash

echo "🚀 Brown Course Catalog - Render Build Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting build process..."

# Step 1: Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed"

# Step 2: Build frontend
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi
print_success "Frontend built successfully"

cd ..

print_success "🎉 Build completed successfully!" 