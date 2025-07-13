import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/signin', { email, password }),
  register: (userData) => api.post('/auth/signup', userData),
};

// Course services
export const courseService = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getMyCourses: () => api.get('/courses/my-courses'),
  getAvailableCourses: () => api.get('/courses/available'),
  createCourse: (courseData) => api.post('/courses', courseData),
  updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  enrollInCourse: (courseId) => api.post(`/courses/${courseId}/enroll`),
  unenrollFromCourse: (courseId) => api.post(`/courses/${courseId}/unenroll`),
};

// Lesson services
export const lessonService = {
  getLessonsByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  createLesson: (courseId, lessonData) => api.post(`/lessons/course/${courseId}`, lessonData),
  updateLesson: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
  markLessonComplete: (lessonId) => api.post(`/lessons/${lessonId}/complete`),
};

// Admin services
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  getUsersByRole: (role) => api.get(`/admin/users/${role}`),
  toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle`),
};

export default api;
