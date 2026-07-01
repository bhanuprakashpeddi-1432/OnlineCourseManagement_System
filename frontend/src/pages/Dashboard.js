import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';

const Dashboard = () => {
  const { currentUser, hasRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getMyCourses();
        setCourses(res.data);
      } catch (err) {
        setError('Failed to load your courses.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const roleLabel = currentUser?.role
    ? currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase()
    : '';

  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase()
    : '';

  const stats = hasRole(['INSTRUCTOR', 'ADMIN'])
    ? [
        { icon: '📘', label: 'My Courses', value: courses.length, iconClass: 'stat-icon-purple' },
        { icon: '👥', label: 'Total Students', value: courses.reduce((a, c) => a + (c.enrollmentCount || 0), 0), iconClass: 'stat-icon-cyan' },
        { icon: '📝', label: 'Total Lessons', value: courses.reduce((a, c) => a + (c.lessonCount || 0), 0), iconClass: 'stat-icon-green' },
        { icon: '⭐', label: 'Avg Rating', value: '4.8', iconClass: 'stat-icon-amber' },
      ]
    : [
        { icon: '📘', label: 'Enrolled Courses', value: courses.length, iconClass: 'stat-icon-purple' },
        { icon: '✅', label: 'Completed', value: courses.filter(c => c.completionPercentage === 100).length, iconClass: 'stat-icon-green' },
        { icon: '⏳', label: 'In Progress', value: courses.filter(c => c.completionPercentage > 0 && c.completionPercentage < 100).length, iconClass: 'stat-icon-cyan' },
        { icon: '🏆', label: 'Certificates', value: courses.filter(c => c.completionPercentage === 100).length, iconClass: 'stat-icon-amber' },
      ];

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.75rem', marginBottom: '0.1rem' }}>
              Hey, {currentUser?.firstName}! 👋
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge-premium badge-purple">{roleLabel}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{currentUser?.email}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {hasRole(['INSTRUCTOR', 'ADMIN']) && (
            <Link to="/create-course" className="btn-premium btn-primary-premium">
              ➕ New Course
            </Link>
          )}
          {hasRole(['STUDENT']) && (
            <Link to="/courses" className="btn-premium btn-ghost-premium">
              🔍 Browse Courses
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.iconClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {hasRole(['INSTRUCTOR', 'ADMIN']) ? '📚 My Courses' : '📖 My Learning'}
          </h2>
          {hasRole(['STUDENT']) && (
            <Link to="/courses" style={{ color: 'var(--color-primary-light)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
              View All →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="spinner-premium">
            <div className="spinner-ring" />
            <p style={{ color: 'var(--text-muted)' }}>Loading your courses...</p>
          </div>
        ) : error ? (
          <div className="alert-premium alert-danger-premium">{error}</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <div className="empty-state-title">
              {hasRole(['INSTRUCTOR', 'ADMIN']) ? "You haven't created any courses yet" : "You haven't enrolled in any courses yet"}
            </div>
            <div className="empty-state-text" style={{ marginBottom: '1.5rem' }}>
              {hasRole(['INSTRUCTOR', 'ADMIN']) ? 'Create your first course and start teaching!' : 'Browse our catalog and start learning today!'}
            </div>
            {hasRole(['INSTRUCTOR', 'ADMIN']) ? (
              <Link to="/create-course" className="btn-premium btn-primary-premium">➕ Create Course</Link>
            ) : (
              <Link to="/courses" className="btn-premium btn-primary-premium">🔍 Browse Courses</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {courses.map((course) => (
              <div key={course.id} className="card-premium course-card-premium">
                <div className="course-card-badge">📘 Course</div>
                <div className="course-card-title">{course.title}</div>
                <div className="course-card-desc">{course.description}</div>

                {hasRole(['STUDENT']) && course.completionPercentage !== undefined && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      <span>Progress</span>
                      <span>{course.completionPercentage || 0}%</span>
                    </div>
                    <div className="progress-premium">
                      <div className="progress-fill" style={{ width: `${course.completionPercentage || 0}%` }} />
                    </div>
                  </div>
                )}

                <div className="course-card-meta">
                  <div className="course-card-avatar">
                    {course.instructorName?.[0] || 'I'}
                  </div>
                  <span>{course.instructorName || 'Instructor'}</span>
                  {course.lessonCount !== undefined && (
                    <span style={{ marginLeft: 'auto' }}>📝 {course.lessonCount} lessons</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <Link to={`/course/${course.id}`} className="btn-premium btn-ghost-premium" style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }}>
                    View Course
                  </Link>
                  {hasRole(['INSTRUCTOR', 'ADMIN']) && (
                    <Link to={`/edit-course/${course.id}`} className="btn-premium btn-ghost-premium" style={{ padding: '0.5rem 0.85rem' }}>
                      ✏️
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;