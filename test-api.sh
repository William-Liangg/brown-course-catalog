#!/bin/bash

echo "🧪 Testing Brown Course Catalog API..."
echo ""

BASE_URL="https://brown-course-catalog.onrender.com"

# Test root endpoint
echo "🏠 Testing root endpoint..."
ROOT_RESPONSE=$(curl -s "$BASE_URL/")
if [[ $ROOT_RESPONSE == *"Brown Course Catalog API"* ]]; then
    echo "   ✅ Root endpoint working"
else
    echo "   ❌ Root endpoint failed: $ROOT_RESPONSE"
fi

echo ""

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
if [[ $HEALTH_RESPONSE == *"API running"* ]]; then
    echo "   ✅ Health endpoint working"
else
    echo "   ❌ Health endpoint failed: $HEALTH_RESPONSE"
fi

echo ""

# Test courses endpoint
echo "📚 Testing courses endpoint..."
COURSES_RESPONSE=$(curl -s "$BASE_URL/api/courses")
if [[ $COURSES_RESPONSE == *"courses"* ]] || [[ $COURSES_RESPONSE == *"error"* ]]; then
    echo "   ✅ Courses endpoint responding"
    echo "   📄 Response: $COURSES_RESPONSE"
else
    echo "   ❌ Courses endpoint failed: $COURSES_RESPONSE"
fi

echo ""

# Test CORS headers
echo "🌐 Testing CORS headers..."
CORS_RESPONSE=$(curl -s -I -H "Origin: https://brown-course-catalog-frontend.onrender.com" "$BASE_URL/api/courses")
if [[ $CORS_RESPONSE == *"access-control-allow-origin"* ]]; then
    echo "   ✅ CORS headers present"
else
    echo "   ❌ CORS headers missing"
fi

echo ""
echo "🎯 API testing complete!" 