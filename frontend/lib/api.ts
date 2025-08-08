import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: any) => api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/password', data),
};

// Applications API calls
export const applicationsAPI = {
  getAll: (params?: any) => api.get('/applications', { params }),
  
  getById: (id: string) => api.get(`/applications/${id}`),
  
  create: (data: any) => api.post('/applications', data),
  
  update: (id: string, data: any) => api.put(`/applications/${id}`, data),
  
  delete: (id: string) => api.delete(`/applications/${id}`),
  
  addNote: (id: string, data: { content: string; type?: string }) =>
    api.post(`/applications/${id}/notes`, data),
  
  addInterview: (id: string, data: any) =>
    api.post(`/applications/${id}/interviews`, data),
  
  getStats: () => api.get('/applications/stats'),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  
  getTrends: (params?: { months?: number }) =>
    api.get('/analytics/trends', { params }),
  
  getStatusDistribution: () => api.get('/analytics/status-distribution'),
  
  getMonthlyGoals: () => api.get('/analytics/goals'),
  
  getRecentActivity: (params?: { limit?: number }) =>
    api.get('/analytics/recent-activity', { params }),
};

// AI API calls
export const aiAPI = {
  generateCoverLetter: (data: {
    jobDescription: string;
    companyName: string;
    positionTitle: string;
    userExperience?: string;
  }) => api.post('/ai/cover-letter', data),
  
  analyzeResume: (data: {
    resumeContent: string;
    jobDescription?: string;
  }) => api.post('/ai/resume-analysis', data),
  
  getSuggestions: () => api.post('/ai/suggestions'),
  
  getInterviewPrep: (data: {
    companyName: string;
    positionTitle: string;
    interviewType?: string;
  }) => api.post('/ai/interview-prep', data),
  
  getJobRecommendations: (params?: {
    location?: string;
    remote?: string;
    experience?: string;
  }) => api.get('/ai/job-recommendations', { params }),
};

export default api;
