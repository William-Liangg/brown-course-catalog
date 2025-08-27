// Utility functions for making authenticated API calls

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `/api${endpoint}`;
  const headers = getAuthHeaders();
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.error || `HTTP error! status: ${response.status}`);
    // Preserve additional data from the error response
    if (errorData.conflicts) {
      (error as any).conflicts = errorData.conflicts;
    }
    throw error;
  }

  return response.json();
};

export const getSchedule = () => apiCall('/schedule');
export const addToSchedule = (courseId: number, term: string) => 
  apiCall('/schedule', {
    method: 'POST',
    body: JSON.stringify({ courseId, term }),
  });
export const removeFromSchedule = (courseId: number) => 
  apiCall(`/schedule/${courseId}`, { method: 'DELETE' });
export const getCourses = (search?: string) => 
  apiCall(search ? `/courses?search=${encodeURIComponent(search)}` : '/courses');

export const getCourseMajors = () => apiCall('/courses/majors');

export const getAICourseRecommendations = (major: string, interests: string) => 
  apiCall('/ai/ai-recommend', {
    method: 'POST',
    body: JSON.stringify({ major, interests }),
  });

export const getDatabaseCourseRecommendations = (major: string) => 
  apiCall(`/recommendations/course-recommendations/${encodeURIComponent(major)}`);

export const updateNames = async (firstName: string, lastName: string) => {
  return apiCall('/update-names', {
    method: 'POST',
    body: JSON.stringify({ firstName, lastName })
  });
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  return apiCall('/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
};

export const deleteAccount = async (password: string) => {
  return apiCall('/delete-account', {
    method: 'DELETE',
    body: JSON.stringify({ password })
  });
}; 