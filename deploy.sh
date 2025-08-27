#!/bin/bash

set -e

echo "🚀 Deploying BrunoTrack..."

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

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_status "Copying env.example to .env..."
    cp env.example .env
    print_warning "Please edit .env file with your actual values before continuing."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_jwt_secret_here_make_it_long_and_random" ]; then
    print_error "JWT_SECRET not set in .env file!"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "your_openai_api_key_here" ]; then
    print_error "OPENAI_API_KEY not set in .env file!"
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "your_secure_password_here" ]; then
    print_error "POSTGRES_PASSWORD not set in .env file!"
    exit 1
fi

print_status "Environment variables validated."

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans || true

# Build the Docker image
print_status "Building Docker image..."
docker build -t bruno-track:latest .

# Start services
print_status "Starting services..."
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ BrunoTrack is running!"
    print_status "🌐 Frontend: http://localhost"
    print_status "🔧 API: http://localhost/api"
    print_status "📊 Health check: http://localhost/health"
else
    print_error "❌ Services failed to start properly."
    print_status "Check logs with: docker-compose logs"
    exit 1
fi

print_status "Deployment complete! 🎉" 