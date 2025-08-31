// API Configuration
export const API_CONFIG = {
  // For development, use the backend server URL
  // For production, this will be empty (relative URLs - same domain)
  baseURL: import.meta.env.PROD 
    ? '' // Same domain, no CORS needed
    : 'http://localhost:3001',
}; 