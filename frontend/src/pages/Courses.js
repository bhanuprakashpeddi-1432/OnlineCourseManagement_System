import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Courses = () => {
  const { currentUser, hasRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(null);
  const [enrolled, setEnrolled] = useState(new Set());

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getAllCourses();
        setCourses(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(courses);
    } else {
      const q = search.toLowerCase();
      setFiltered(courses.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.instructorName?.toLowerCase().includes(q)
      ));
    }
  }, [search, courses]);

  const handleEnroll = async (courseId) => {
    if (!currentUser) return;
    setEnrolling(courseId);
    try {
      await courseService.enrollInCourse(courseId);
      setEnrolled(prev => new Set([...prev, courseId]));
    } catch (err) {
      alert(err.response?.data || 'Failed to enroll. You may already be enrolled.');
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            Explore <span className="gradient-text">Courses</span>
          </h1>
          <p className="page-subtitle">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search courses, instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {hasRole(['INSTRUCTOR', 'ADMIN']) && (
            <Link to="/create-course" className="btn-premium btn-primary-premium">
              ➕ Create Course
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="spinner-premium">
          <div className="spinner-ring" />
          <p style={{ color: 'var(--text-muted)' }}>Loading courses...</p>
        </div>
      ) : error ? (
        <div className="alert-premium alert-danger-premium">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔭</div>
          <div className="empty-state-title">No courses found</div>
          <div className="empty-state-text">
            {search ? `No results for "${search}". Try a different search term.` : 'No courses available yet. Check back soon!'}
          </div>
          {search && (
            <button className="btn-premium btn-ghost-premium" style={{ marginTop: '1rem' }} onClick={() => setSearch('')}>
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((course) => {
            const isEnrolled = enrolled.has(course.id);
            return (
              <div key={course.id} className="card-premium course-card-premium">
                <div className="course-card-badge">📘 {course.active ? 'Active' : 'Inactive'}</div>
                <div className="course-card-title">{course.title}</div>
                <div className="course-card-desc">{course.description}</div>

                <div className="course-card-meta">
                  <div className="course-card-avatar">
                    {(course.instructorName || 'I')[0].toUpperCase()}
                  </div>
                  <span>{course.instructorName || 'Instructor'}</span>
                  {course.lessonCount !== undefined && (
                    <span style={{ marginLeft: 'auto' }}>📝 {course.lessonCount} lessons</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                  <Link
                    to={`/course/${course.id}`}
                    className="btn-premium btn-ghost-premium"
                    style={{ flex: 1, justifyContent: 'center', padding: '0.5rem' }}
                  >
                    View Details
                  </Link>
                  {hasRole(['STUDENT']) && (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={isEnrolled || enrolling === course.id}
                      className={`btn-premium ${isEnrolled ? '' : 'btn-primary-premium'}`}
                      style={{
                        flex: 1, justifyContent: 'center', padding: '0.5rem',
                        background: isEnrolled ? 'rgba(16,185,129,0.15)' : undefined,
                        color: isEnrolled ? 'var(--color-success)' : undefined,
                        border: isEnrolled ? '1px solid rgba(16,185,129,0.3)' : undefined,
                        opacity: enrolling === course.id ? 0.7 : 1,
                      }}
                    >
                      {isEnrolled ? '✅ Enrolled' : enrolling === course.id ? 'Enrolling...' : '🚀 Enroll'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Courses;