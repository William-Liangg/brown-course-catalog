const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'testpassword123';
const TEST_FIRST_NAME = 'Test';
const TEST_LAST_NAME = 'User';

let authToken = null;
let userId = null;

async function testAPIEndpoints() {
  console.log('🧪 Brown Course Catalog API Testing');
  console.log('=' .repeat(50));
  console.log(`Base URL: ${BASE_URL}`);
  
  try {
    // 1. Health Check
    console.log('\n🏥 1. Health Check');
    console.log('-'.repeat(30));
    
    try {
      const healthResponse = await axios.get(`${BASE_URL}/health`);
      console.log('✅ Health check passed:', healthResponse.data);
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return;
    }
    
    // 2. Test Signup
    console.log('\n🔐 2. Test User Signup');
    console.log('-'.repeat(30));
    
    try {
      const signupResponse = await axios.post(`${BASE_URL}/api/signup`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        firstName: TEST_FIRST_NAME,
        lastName: TEST_LAST_NAME
      }, {
        withCredentials: true
      });
      
      console.log('✅ Signup successful:', {
        userId: signupResponse.data.user.id,
        email: signupResponse.data.user.email,
        message: signupResponse.data.message
      });
      
      userId = signupResponse.data.user.id;
      
      // Check for auth cookie
      const cookies = signupResponse.headers['set-cookie'];
      if (cookies && cookies.some(cookie => cookie.includes('authToken'))) {
        console.log('✅ Auth cookie set');
      } else {
        console.log('⚠️  No auth cookie found');
      }
      
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  User already exists, proceeding with login test');
      } else {
        console.error('❌ Signup failed:', {
          status: error.response?.status,
          message: error.response?.data?.error || error.message
        });
      }
    }
    
    // 3. Test Login
    console.log('\n🔐 3. Test User Login');
    console.log('-'.repeat(30));
    
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD
      }, {
        withCredentials: true
      });
      
      console.log('✅ Login successful:', {
        userId: loginResponse.data.user.id,
        email: loginResponse.data.user.email,
        message: loginResponse.data.message
      });
      
      userId = loginResponse.data.user.id;
      
      // Check for auth cookie
      const cookies = loginResponse.headers['set-cookie'];
      if (cookies && cookies.some(cookie => cookie.includes('authToken'))) {
        console.log('✅ Auth cookie set');
        // Extract token for subsequent requests
        const authCookie = cookies.find(cookie => cookie.includes('authToken'));
        if (authCookie) {
          authToken = authCookie.split(';')[0].split('=')[1];
        }
      } else {
        console.log('⚠️  No auth cookie found');
      }
      
    } catch (error) {
      console.error('❌ Login failed:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    // 4. Test Get User Profile
    console.log('\n👤 4. Test Get User Profile');
    console.log('-'.repeat(30));
    
    if (authToken) {
      try {
        const profileResponse = await axios.get(`${BASE_URL}/api/me`, {
          headers: {
            Cookie: `authToken=${authToken}`
          },
          withCredentials: true
        });
        
        console.log('✅ Profile retrieval successful:', {
          userId: profileResponse.data.user.id,
          email: profileResponse.data.user.email,
          name: `${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`
        });
        
      } catch (error) {
        console.error('❌ Profile retrieval failed:', {
          status: error.response?.status,
          message: error.response?.data?.error || error.message
        });
      }
    } else {
      console.log('⚠️  Skipping profile test - no auth token');
    }
    
    // 5. Test Courses Endpoint
    console.log('\n📚 5. Test Courses Endpoint');
    console.log('-'.repeat(30));
    
    try {
      const coursesResponse = await axios.get(`${BASE_URL}/api/courses`);
      
      console.log('✅ Courses retrieval successful:', {
        count: coursesResponse.data.count,
        hasCourses: coursesResponse.data.courses?.length > 0,
        firstCourse: coursesResponse.data.courses?.[0]?.code || 'none'
      });
      
      if (coursesResponse.data.courses?.length > 0) {
        console.log('Sample course:', {
          code: coursesResponse.data.courses[0].code,
          name: coursesResponse.data.courses[0].name,
          instructor: coursesResponse.data.courses[0].instructor
        });
      }
      
    } catch (error) {
      console.error('❌ Courses retrieval failed:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    // 6. Test Courses Search
    console.log('\n🔍 6. Test Courses Search');
    console.log('-'.repeat(30));
    
    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/courses?search=computer`);
      
      console.log('✅ Courses search successful:', {
        count: searchResponse.data.count,
        searchTerm: 'computer',
        hasResults: searchResponse.data.courses?.length > 0
      });
      
      if (searchResponse.data.courses?.length > 0) {
        console.log('Sample search result:', {
          code: searchResponse.data.courses[0].code,
          name: searchResponse.data.courses[0].name
        });
      }
      
    } catch (error) {
      console.error('❌ Courses search failed:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    // 7. Test Course Majors
    console.log('\n🎓 7. Test Course Majors');
    console.log('-'.repeat(30));
    
    try {
      const majorsResponse = await axios.get(`${BASE_URL}/api/courses/majors`);
      
      console.log('✅ Course majors retrieval successful:', {
        count: majorsResponse.data.count,
        hasMajors: majorsResponse.data.majors?.length > 0,
        sampleMajors: majorsResponse.data.majors?.slice(0, 5) || []
      });
      
    } catch (error) {
      console.error('❌ Course majors retrieval failed:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    // 8. Test Schedule Endpoints (if authenticated)
    console.log('\n📅 8. Test Schedule Endpoints');
    console.log('-'.repeat(30));
    
    if (authToken) {
      try {
        const schedulesResponse = await axios.get(`${BASE_URL}/api/schedule`, {
          headers: {
            Cookie: `authToken=${authToken}`
          },
          withCredentials: true
        });
        
        console.log('✅ Schedules retrieval successful:', {
          count: schedulesResponse.data.schedules?.length || 0
        });
        
      } catch (error) {
        console.error('❌ Schedules retrieval failed:', {
          status: error.response?.status,
          message: error.response?.data?.error || error.message
        });
      }
    } else {
      console.log('⚠️  Skipping schedule test - no auth token');
    }
    
    // 9. Test Logout
    console.log('\n🚪 9. Test Logout');
    console.log('-'.repeat(30));
    
    try {
      const logoutResponse = await axios.post(`${BASE_URL}/api/logout`, {}, {
        headers: authToken ? { Cookie: `authToken=${authToken}` } : {},
        withCredentials: true
      });
      
      console.log('✅ Logout successful:', logoutResponse.data.message);
      
    } catch (error) {
      console.error('❌ Logout failed:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    }
    
    // 10. Test Invalid Endpoints
    console.log('\n🚫 10. Test Invalid Endpoints');
    console.log('-'.repeat(30));
    
    try {
      await axios.get(`${BASE_URL}/api/nonexistent`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ 404 handling works correctly');
      } else {
        console.log('⚠️  Unexpected response for invalid endpoint:', error.response?.status);
      }
    }
    
    // Summary
    console.log('\n📋 Test Summary');
    console.log('-'.repeat(30));
    console.log('✅ API testing completed');
    console.log('💡 Check the logs above for any issues');
    
  } catch (error) {
    console.error('❌ API testing failed:', error.message);
  }
}

testAPIEndpoints(); 