#!/bin/bash

set -e

echo "🚀 Brown Course Catalog - Universal Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get user input with default
get_input() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    if [ -n "$default" ]; then
        echo -n "$prompt [$default]: "
    else
        echo -n "$prompt: "
    fi
    
    read -r input
    if [ -z "$input" ] && [ -n "$default" ]; then
        input="$default"
    fi
    eval "$var_name='$input'"
}

# Check prerequisites
print_step "Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
    print_error "Node.js is not installed!"
    print_warning "Please install Node.js from https://nodejs.org/ (version 18 or higher)"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    print_warning "Please update Node.js from https://nodejs.org/"
    exit 1
fi
print_status "✅ Node.js version: $(node --version)"

# Check npm
if ! command_exists npm; then
    print_error "npm is not installed!"
    exit 1
fi
print_status "✅ npm is available"

# Get project directory (works from any location)
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
print_status "✅ Project directory: $PROJECT_DIR"

# Change to project directory
cd "$PROJECT_DIR"

# Check if .env file exists
if [ ! -f .env ]; then
    print_step "Setting up environment variables..."
    print_warning ".env file not found!"
    print_status "Creating .env file from template..."
    cp env.example .env
    
    print_status "Please configure your environment variables:"
    echo ""
    
    # Get database URL
    get_input "Enter your PostgreSQL DATABASE_URL" "postgres://username:password@localhost:5432/brown_course_catalog" DATABASE_URL
    
    # Get JWT secret
    get_input "Enter your JWT_SECRET (or press Enter to generate one)" "" JWT_SECRET
    if [ -z "$JWT_SECRET" ]; then
        JWT_SECRET=$(openssl rand -hex 32)
        print_status "Generated JWT_SECRET: $JWT_SECRET"
    fi
    
    # Get OpenAI API key (optional)
    get_input "Enter your OPENAI_API_KEY (optional, press Enter to skip)" "" OPENAI_API_KEY
    
    # Get port
    get_input "Enter backend port" "3001" PORT
    
    # Update .env file
    cat > .env << EOF
# Local Development Environment Variables
# Copy this file to .env.local and fill in your values

# Database Configuration
DATABASE_URL=$DATABASE_URL

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# OpenAI Configuration (if using AI features)
OPENAI_API_KEY=$OPENAI_API_KEY

# Environment
NODE_ENV=development

# Frontend API URL (for local development)
VITE_API_URL=http://localhost:$PORT
EOF
    
    print_status "✅ .env file created with your configuration"
else
    print_status "✅ .env file already exists"
fi

# Install dependencies
print_step "Installing dependencies..."

# Function to install dependencies with fallback
install_dependencies() {
    local dir="$1"
    local name="$2"
    
    if [ -d "$dir" ]; then
        print_status "Installing $name dependencies..."
        cd "$dir"
        
        # Try npm first
        if npm install; then
            print_status "✅ $name dependencies installed with npm"
        else
            print_warning "npm failed, trying yarn..."
            if command_exists yarn; then
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
        
        cd "$PROJECT_DIR"
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

# Install root dependencies needed for setup
print_status "Installing additional root dependencies..."
npm install pg dotenv

print_status "✅ All dependencies installed successfully!"

# Setup database
print_step "Setting up database..."
if node setup-database.js; then
    print_status "✅ Database setup complete!"
else
    print_warning "⚠️  Database setup failed. You may need to configure your DATABASE_URL in .env"
    print_warning "Make sure your PostgreSQL database is running and accessible"
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
print_status "🌐 Frontend will be available at: http://localhost:5173 (or next available port)"
print_status "🔧 API will be available at: http://localhost:$PORT/api"
print_status ""
print_status "📚 See LOCAL_DEVELOPMENT.md for detailed instructions"
print_status "🛠️  See TROUBLESHOOTING.md if you encounter issues"
print_status ""
print_status "💡 This setup works on any device with Node.js 18+ installed!" 