import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import LessonDetail from './pages/LessonDetail';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateCourse from './pages/CreateCourse';
import EditCourse from './pages/EditCourse';
import CreateLesson from './pages/CreateLesson';
import EditLesson from './pages/EditLesson';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/courses" element={<Courses />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/course/:id" element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/lesson/:id" element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/create-course" element={
                <ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}>
                  <CreateCourse />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-course/:id" element={
                <ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}>
                  <EditCourse />
                </ProtectedRoute>
              } />
              
              <Route path="/course/:courseId/create-lesson" element={
                <ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}>
                  <CreateLesson />
                </ProtectedRoute>
              } />
              
              <Route path="/edit-lesson/:id" element={
                <ProtectedRoute roles={['INSTRUCTOR', 'ADMIN']}>
                  <EditLesson />
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          
          <footer className="footer">
            <div className="container">
              <p>&copy; 2024 Online Course Management System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
