#!/bin/bash

echo "🔍 Checking Brown Course Catalog Backend Status..."
echo ""

# Test basic connectivity
echo "📡 Testing basic connectivity..."
if curl -s https://brown-course-catalog.onrender.com > /dev/null; then
    echo "   ✅ Backend is reachable"
else
    echo "   ❌ Backend is not reachable"
    exit 1
fi

echo ""

# Test health endpoint
echo "🏥 Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s https://brown-course-catalog.onrender.com/health)
if [[ $HEALTH_RESPONSE == *"API running"* ]]; then
    echo "   ✅ Health endpoint working: $HEALTH_RESPONSE"
else
    echo "   ❌ Health endpoint failed: $HEALTH_RESPONSE"
fi

echo ""

# Test root endpoint
echo "🏠 Testing root endpoint..."
ROOT_RESPONSE=$(curl -s https://brown-course-catalog.onrender.com/)
if [[ $ROOT_RESPONSE == *"Brown Course Catalog API"* ]]; then
    echo "   ✅ Root endpoint working"
else
    echo "   ❌ Root endpoint failed: $ROOT_RESPONSE"
fi

echo ""

# Test courses endpoint
echo "📚 Testing courses endpoint..."
COURSES_RESPONSE=$(curl -s https://brown-course-catalog.onrender.com/api/courses)
if [[ $COURSES_RESPONSE == *"error"* ]]; then
    echo "   ⚠️  Courses endpoint has issues: $COURSES_RESPONSE"
    echo "   💡 This suggests a database connection problem"
else
    echo "   ✅ Courses endpoint working"
fi

echo ""
echo "🔧 Troubleshooting Steps:"
echo "1. If you see 'Bad Gateway' in browser, try:"
echo "   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)"
echo "   - Clear browser cache"
echo "   - Try incognito/private mode"
echo ""
echo "2. If courses endpoint has errors:"
echo "   - Check Render logs for database connection issues"
echo "   - Ensure DATABASE_URL environment variable is set"
echo "   - Run database setup: npm run setup-db"
echo ""
echo "3. Check Render Dashboard:"
echo "   - Go to your backend service"
echo "   - Check 'Logs' tab for errors"
echo "   - Verify environment variables are set" 