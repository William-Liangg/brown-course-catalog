#!/bin/bash

echo "🔍 Checking Brown Course Catalog Services Status..."
echo ""

# Check backend
echo "📡 Backend Status:"
if curl -s https://brown-course-catalog.onrender.com > /dev/null; then
    echo "   ✅ Backend is running"
    echo "   🌐 URL: https://brown-course-catalog.onrender.com"
else
    echo "   ❌ Backend is not responding"
fi

echo ""

# Check frontend
echo "🎨 Frontend Status:"
if curl -s https://brown-course-catalog-frontend.onrender.com > /dev/null; then
    echo "   ✅ Frontend is running"
    echo "   🌐 URL: https://brown-course-catalog-frontend.onrender.com"
else
    echo "   ❌ Frontend is not responding"
fi

echo ""
echo "💡 If services are not responding, check your Render dashboard for deployment status." 