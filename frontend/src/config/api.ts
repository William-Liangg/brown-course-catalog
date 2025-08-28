// API Configuration for Brown Course Catalog
// Supports both local development and Vercel production deployment

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Debug logging
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD
});

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      signup: '/api/signup',
      login: '/api/login',
      logout: '/api/logout',
      me: '/api/me'
    },
    courses: {
      all: '/api/courses',
      majors: '/api/courses/majors'
    },
    schedule: {
      base: '/api/schedule'
    },
    ai: {
      recommend: '/api/ai/ai-recommend'
    },
    recommendations: {
      base: '/api/recommendations'
    },
    test: '/api/test'
  }
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // For production, use relative URLs (same domain)
  // For development, use the full API URL
  const isProduction = import.meta.env.PROD;
  const baseURL = isProduction ? '' : API_BASE_URL;
  const url = `${baseURL}${endpoint}`;
  
  console.log('🌐 Making API request to:', url);
  
  const config: RequestInit = {
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    console.log('📡 API response status:', response.status);
    
    if (!response.ok) {
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.error('❌ API request failed:', data);
        throw new Error(data.error || data.details || 'API request failed');
      } else {
        const text = await response.text();
        console.error('❌ API request failed with non-JSON response:', text);
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
    }
    
    const data = await response.json();
    console.log('✅ API request successful:', data);
    return data;
  } catch (error) {
    console.error('❌ API request error:', error);
    throw error;
  }
};

// Helper functions for specific API calls
export const authAPI = {
  signup: (userData: { email: string; password: string; name: string }) =>
    apiRequest(API_CONFIG.endpoints.auth.signup, {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  login: (credentials: { email: string; password: string }) =>
    apiRequest(API_CONFIG.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  logout: () =>
    apiRequest(API_CONFIG.endpoints.auth.logout, {
      method: 'POST'
    }),
  
  me: () =>
    apiRequest(API_CONFIG.endpoints.auth.me, {
      method: 'GET'
    })
};

export const coursesAPI = {
  getAll: () =>
    apiRequest(API_CONFIG.endpoints.courses.all, {
      method: 'GET'
    }),
  
  getMajors: () =>
    apiRequest(API_CONFIG.endpoints.courses.majors, {
      method: 'GET'
    })
};

export const testAPI = {
  test: () =>
    apiRequest(API_CONFIG.endpoints.test, {
      method: 'GET'
    })
}; 