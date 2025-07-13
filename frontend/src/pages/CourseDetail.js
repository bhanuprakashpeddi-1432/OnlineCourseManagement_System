import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService, lessonService } from '../services/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { currentUser, hasRole } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourseDetails = useCallback(async () => {
    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        courseService.getCourseById(id),
        lessonService.getLessonsByCourse(id)
      ]);
      
      setCourse(courseResponse.data);
      // Ensure lessons is always an array
      const lessonsData = Array.isArray(lessonsResponse.data) ? lessonsResponse.data : [];
      setLessons(lessonsData);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      setError('Failed to fetch course details. Please try again later.');
      setCourse(null);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleEnroll = async () => {
    try {
      await courseService.enrollInCourse(id);
      alert('Successfully enrolled in the course!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data || 'Failed to enroll in course');
    }
  };

  const handleUnenroll = async () => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await courseService.unenrollFromCourse(id);
        alert('Successfully unenrolled from the course');
        navigate('/dashboard');
      } catch (error) {
        alert(error.response?.data || 'Failed to unenroll from course');
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        console.log('Deleting course with ID:', id);
        await courseService.deleteCourse(id);
        alert('Course deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to delete course:', error);
        alert(error.response?.data?.message || error.message || 'Failed to delete course');
      }
    }
  };

  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (window.confirm(`Are you sure you want to delete the lesson "${lessonTitle}"? This action cannot be undone.`)) {
      try {
        console.log('Deleting lesson with ID:', lessonId);
        await lessonService.deleteLesson(lessonId);
        alert('Lesson deleted successfully');
        // Refresh the course details to update the lessons list
        fetchCourseDetails();
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        alert(error.response?.data?.message || error.message || 'Failed to delete lesson');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading course details...</p>
        </div>
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container>
        <Alert variant="danger">{error || 'Course not found'}</Alert>
      </Container>
    );
  }

  const isInstructor = hasRole(['INSTRUCTOR', 'ADMIN']) && 
    (course.instructor.id === currentUser.id || hasRole(['ADMIN']));

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1>{course.title}</h1>
              <p className="lead">{course.description}</p>
              <p>
                <strong>Instructor:</strong> {course.instructor.firstName} {course.instructor.lastName}
              </p>
            </div>
            <div>
              {isInstructor && (
                <div className="d-grid gap-2">
                  <Button as={Link} to={`/edit-course/${course.id}`} variant="outline-primary">
                    Edit Course
                  </Button>
                  <Button 
                    as={Link} 
                    to={`/course/${course.id}/create-lesson`} 
                    variant="success"
                  >
                    Add Lesson
                  </Button>
                  <Button onClick={handleDeleteCourse} variant="danger">
                    Delete Course
                  </Button>
                </div>
              )}
              
              {hasRole(['STUDENT']) && !isInstructor && (
                <div className="d-grid gap-2">
                  <Button onClick={handleEnroll} variant="primary">
                    Enroll in Course
                  </Button>
                  <Button onClick={handleUnenroll} variant="outline-danger">
                    Unenroll
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h3>Course Lessons</h3>
              {isInstructor && (
                <Button 
                  as={Link} 
                  to={`/course/${course.id}/create-lesson`} 
                  variant="primary"
                  size="sm"
                >
                  Add New Lesson
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {!Array.isArray(lessons) || lessons.length === 0 ? (
                <Alert variant="info">
                  No lessons available in this course yet.
                  {isInstructor && (
                    <> <Alert.Link as={Link} to={`/course/${course.id}/create-lesson`}>
                      Add the first lesson
                    </Alert.Link></>
                  )}
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {lessons.map((lesson, index) => (
                    <ListGroup.Item 
                      key={lesson.id} 
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">
                          {lesson.order || index + 1}. {lesson.title}
                        </h6>
                        {lesson.content && (
                          <p className="mb-1 text-muted">
                            {lesson.content.substring(0, 100)}
                            {lesson.content.length > 100 ? '...' : ''}
                          </p>
                        )}
                        {lesson.videoUrl && (
                          <small className="text-primary">📹 Video content available</small>
                        )}
                      </div>
                      <div>
                        <Button 
                          as={Link} 
                          to={`/lesson/${lesson.id}`} 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                        >
                          View
                        </Button>
                        {isInstructor && (
                          <>
                            <Button 
                              as={Link} 
                              to={`/edit-lesson/${lesson.id}`} 
                              variant="outline-secondary" 
                              size="sm"
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button 
                              onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                              variant="outline-danger" 
                              size="sm"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetail;
