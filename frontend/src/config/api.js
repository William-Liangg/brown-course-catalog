const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}; 