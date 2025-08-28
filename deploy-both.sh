#!/bin/bash

echo "🚀 Deploying Brown Course Catalog to Render..."

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Please install it first:"
    echo "   npm install -g @render/cli"
    echo "   render login"
    exit 1
fi

# Deploy using render.yaml
echo "📦 Deploying services from render.yaml..."
render deploy

echo "✅ Deployment initiated!"
echo ""
echo "🌐 Your services will be available at:"
echo "   Backend: https://brown-course-catalog.onrender.com"
echo "   Frontend: https://brown-course-catalog-frontend.onrender.com"
echo ""
echo "⏳ Deployment takes 2-3 minutes. Check your Render dashboard for status." 