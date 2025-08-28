#!/bin/bash

echo "🚀 Vercel Deployment Script for Brown Course Catalog"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please run:"
    echo "   vercel login"
    echo "   Then run this script again."
    exit 1
fi

echo "✅ Vercel CLI ready"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json not found. Please ensure it exists."
    exit 1
fi

echo "📋 Environment Variables Checklist:"
echo "=================================="
echo "Make sure you have these environment variables ready:"
echo ""
echo "Backend Variables (set in Vercel dashboard):"
echo "  - DATABASE_URL: Your Render PostgreSQL external URL"
echo "  - JWT_SECRET: Your JWT secret key"
echo "  - NODE_ENV: production"
echo ""
echo "Frontend Variables (set after deployment):"
echo "  - VITE_API_URL: Your Vercel deployment URL"
echo ""

read -p "Do you have your environment variables ready? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please prepare your environment variables first."
    exit 1
fi

echo "🚀 Starting Vercel deployment..."
echo "This will open a browser window for configuration."

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - Go to your project in Vercel dashboard"
echo "   - Go to Settings > Environment Variables"
echo "   - Add DATABASE_URL, JWT_SECRET, and NODE_ENV"
echo ""
echo "2. Update frontend environment:"
echo "   - Set VITE_API_URL to your Vercel deployment URL"
echo "   - Redeploy if needed"
echo ""
echo "3. Test your deployment:"
echo "   - Visit your Vercel URL"
echo "   - Test API endpoints"
echo "   - Test frontend functionality" 