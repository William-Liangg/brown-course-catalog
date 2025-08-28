#!/bin/bash

echo "🧪 Testing Local Setup..."
echo "=========================="

# Test 1: Backend Health
echo "1. Testing backend health..."
if curl -s http://localhost:3001/health > /dev/null; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is not running"
    exit 1
fi

# Test 2: Authentication
echo "2. Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}')

if echo "$LOGIN_RESPONSE" | jq -e '.token' > /dev/null; then
    echo "   ✅ Login successful"
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
else
    echo "   ❌ Login failed"
    exit 1
fi

# Test 3: Protected Route
echo "3. Testing protected route..."
if curl -s -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -e '.user' > /dev/null; then
    echo "   ✅ Protected route works"
else
    echo "   ❌ Protected route failed"
    exit 1
fi

# Test 4: Course Data
echo "4. Testing course data..."
COURSE_COUNT=$(curl -s http://localhost:3001/api/courses | jq '.courses | length')
if [ "$COURSE_COUNT" -gt 1000 ]; then
    echo "   ✅ Found $COURSE_COUNT courses"
else
    echo "   ❌ Course count too low: $COURSE_COUNT"
    exit 1
fi

# Test 5: Professor Data
echo "5. Testing professor data..."
PROFESSOR_COUNT=$(curl -s http://localhost:3001/api/courses | jq '.courses[] | select(.professor != null) | .professor' | wc -l)
if [ "$PROFESSOR_COUNT" -gt 100 ]; then
    echo "   ✅ Found $PROFESSOR_COUNT courses with professors"
else
    echo "   ❌ Professor count too low: $PROFESSOR_COUNT"
    exit 1
fi

# Test 6: Frontend
echo "6. Testing frontend..."
if curl -s http://localhost:5173/ | grep -q "doctype"; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend is not running"
    exit 1
fi

# Test 7: Frontend API Proxy
echo "7. Testing frontend API proxy..."
if curl -s -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}' | jq -e '.token' > /dev/null; then
    echo "   ✅ Frontend API proxy works"
else
    echo "   ❌ Frontend API proxy failed"
    exit 1
fi

echo ""
echo "🎉 All tests passed! Local setup is working correctly."
echo ""
echo "📋 Quick Access:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo "   Test User: test@brown.edu / password123"
echo ""
echo "📚 Next Steps:"
echo "   1. Open http://localhost:5173 in your browser"
echo "   2. Login with the test credentials"
echo "   3. Browse courses and verify professor names are displayed"
echo "   4. Add courses to your schedule" 