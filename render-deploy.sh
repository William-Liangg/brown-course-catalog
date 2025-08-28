#!/bin/bash

echo "🚀 Brown Course Catalog - Render Deployment Script"
echo "=================================================="

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting deployment process..."

# Step 1: Validate environment variables
print_status "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL is not set"
    print_warning "Please set your PostgreSQL connection string"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    print_error "JWT_SECRET is not set"
    print_warning "Please set a secure JWT secret"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    print_error "OPENAI_API_KEY is not set"
    print_warning "Please set your OpenAI API key"
    exit 1
fi

print_success "Environment variables validated"

# Step 2: Install dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
print_success "Backend dependencies installed"

# Step 3: Setup database
print_status "Setting up database..."
npm run setup-db
if [ $? -ne 0 ]; then
    print_error "Failed to setup database"
    exit 1
fi
print_success "Database setup completed"

# Step 4: Test server
print_status "Testing server configuration..."
npm run deploy
if [ $? -ne 0 ]; then
    print_error "Server configuration test failed"
    exit 1
fi
print_success "Server configuration validated"

# Step 5: Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed"

# Step 6: Build frontend
print_status "Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi
print_success "Frontend built successfully"

cd ..

print_success "🎉 Deployment setup completed!"
echo ""
print_status "Next steps:"
echo "1. Deploy to Render using the following settings:"
echo ""
echo "   BACKEND SERVICE:"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install && npm run setup-db"
echo "   - Start Command: npm start"
echo "   - Environment: Node"
echo ""
echo "   FRONTEND SERVICE:"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: build"
echo "   - Environment: Static Site"
echo ""
echo "2. Set environment variables in Render:"
echo "   - DATABASE_URL"
echo "   - JWT_SECRET"
echo "   - OPENAI_API_KEY"
echo "   - VITE_API_URL (for frontend)"
echo ""
echo "3. Test your deployment:"
echo "   - Backend: https://your-backend-name.onrender.com/health"
echo "   - Frontend: https://your-frontend-name.onrender.com" 