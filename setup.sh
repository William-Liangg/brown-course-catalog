#!/bin/bash

set -e

echo "🚀 Setting up Brown Course Catalog..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    print_warning "Please update Node.js from https://nodejs.org/"
    exit 1
fi
print_status "✅ Node.js version: $(node --version)"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found!"
    print_status "Copying env.example to .env..."
    cp env.example .env
    print_warning "Please edit .env file with your actual values before continuing."
    print_warning "Required variables: DATABASE_URL, JWT_SECRET, OPENAI_API_KEY"
fi

# Function to install dependencies with fallback
install_dependencies() {
    local dir=$1
    local name=$2
    
    print_status "Installing $name dependencies..."
    
    if [ -d "$dir" ]; then
        cd "$dir"
        
        # Try npm first
        if npm install; then
            print_status "✅ $name dependencies installed with npm"
        else
            print_warning "npm failed, trying yarn..."
            if command -v yarn &> /dev/null; then
                if yarn install; then
                    print_status "✅ $name dependencies installed with yarn"
                else
                    print_error "❌ Both npm and yarn failed for $name"
                    return 1
                fi
            else
                print_error "❌ npm failed and yarn is not installed"
                return 1
            fi
        fi
        
        cd ..
    else
        print_warning "Directory $dir not found, skipping..."
    fi
}

# Clear npm cache
print_status "Clearing npm cache..."
npm cache clean --force

# Install dependencies for each directory
install_dependencies "." "root"
install_dependencies "frontend" "frontend"
install_dependencies "backend" "backend"
install_dependencies "api" "API"

print_status "✅ All dependencies installed successfully!"

# Setup database
print_status "Setting up database..."
if node setup-database.js; then
    print_status "✅ Database setup complete!"
else
    print_warning "⚠️  Database setup failed. You may need to configure your DATABASE_URL in .env"
fi

print_status ""
print_status "🎉 Setup complete!"
print_status ""
print_status "🚀 To start development servers:"
print_status ""
print_status "Terminal 1 - Backend:"
print_status "  npm run backend"
print_status ""
print_status "Terminal 2 - Frontend:"
print_status "  npm run dev"
print_status ""
print_status "🌐 Frontend will be available at: http://localhost:5173"
print_status "🔧 API will be available at: http://localhost:3000/api"
print_status ""
print_status "📚 See LOCAL_DEVELOPMENT.md for detailed instructions"
print_status "🛠️  See TROUBLESHOOTING.md if you encounter issues" 