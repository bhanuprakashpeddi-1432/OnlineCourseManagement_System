import axios from 'axios';

const API_BASE_URL = '/api';

// Create a single, configured axios instance for all API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attaches JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handles expired tokens without full page reload
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Emit a custom event so AuthContext can handle logout + SPA navigation
      // This avoids window.location.href which breaks the SPA
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

// ─── Auth Services ────────────────────────────────────────────────────────────
export const authService = {
  login: (email, password) => api.post('/auth/signin', { email, password }),
  register: (userData) => api.post('/auth/signup', userData),
};

// ─── Course Services ──────────────────────────────────────────────────────────
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

// ─── Lesson Services ──────────────────────────────────────────────────────────
export const lessonService = {
  getLessonsByCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  getLessonById: (id) => api.get(`/lessons/${id}`),
  createLesson: (courseId, lessonData) => api.post(`/lessons/course/${courseId}`, lessonData),
  updateLesson: (id, lessonData) => api.put(`/lessons/${id}`, lessonData),
  deleteLesson: (id) => api.delete(`/lessons/${id}`),
  markLessonComplete: (lessonId) => api.post(`/lessons/${lessonId}/complete`),
};

// ─── Admin Services ───────────────────────────────────────────────────────────
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  toggleUserStatus: (userId) => api.put(`/admin/users/${userId}/toggle`),
};

export default api;

