#!/bin/bash

echo "🧪 Testing BrunoTrack build locally..."

# Test TypeScript compilation
echo "📝 Checking TypeScript compilation..."
cd src && npx tsc --noEmit && cd ..
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    exit 1
fi

# Test frontend build
echo "🏗️ Testing frontend build..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Test Docker build
echo "🐳 Testing Docker build..."
docker build -t bruno-track-test .
if [ $? -eq 0 ]; then
    echo "✅ Docker build successful"
    echo "🧹 Cleaning up test image..."
    docker rmi bruno-track-test
else
    echo "❌ Docker build failed"
    exit 1
fi

echo "🎉 All builds successful! Ready for deployment." 