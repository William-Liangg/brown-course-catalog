#!/bin/bash

echo "🔍 Testing Backend Endpoints..."
echo ""

# Test root endpoint
echo "🏠 Root endpoint:"
curl -s https://brown-course-catalog.onrender.com/ | jq .
echo ""

# Test health endpoint
echo "🏥 Health endpoint:"
curl -s https://brown-course-catalog.onrender.com/health | jq .
echo ""

# Test courses endpoint
echo "📚 Courses endpoint:"
curl -s https://brown-course-catalog.onrender.com/api/courses | jq .
echo ""

# Test with verbose output to see headers
echo "🔍 Verbose courses test:"
curl -v https://brown-course-catalog.onrender.com/api/courses
echo "" 