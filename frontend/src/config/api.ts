const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Debug logging
console.log('🔧 API Configuration:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  environment: import.meta.env.MODE
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
    }
  }
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
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
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ API request failed:', data);
      throw new Error(data.error || 'API request failed');
    }
    
    console.log('✅ API request successful:', data);
    return data;
  } catch (error) {
    console.error('❌ API request error:', error);
    throw error;
  }
}; 