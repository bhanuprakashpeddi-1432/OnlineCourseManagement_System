import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';

const Dashboard = () => {
  const { currentUser, hasRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const response = await courseService.getMyCourses();
      // Ensure courses is always an array
      const coursesData = Array.isArray(response.data) ? response.data : [];
      setCourses(coursesData);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError('Failed to fetch courses. Please try again later.');
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getRoleBasedTitle = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return 'Admin Dashboard';
      case 'INSTRUCTOR':
        return 'Instructor Dashboard';
      case 'STUDENT':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const getRoleBasedSubtitle = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return 'Manage the platform and monitor all activities';
      case 'INSTRUCTOR':
        return 'Manage your courses and track student progress';
      case 'STUDENT':
        return 'Continue your learning journey';
      default:
        return 'Welcome to your dashboard';
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>{getRoleBasedTitle()}</h1>
          <p className="lead">Welcome back, {currentUser.firstName}! {getRoleBasedSubtitle()}</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3>{Array.isArray(courses) ? courses.length : 0}</h3>
              <p>{hasRole(['STUDENT']) ? 'Enrolled Courses' : 'My Courses'}</p>
            </Card.Body>
          </Card>
        </Col>
        
        {hasRole(['INSTRUCTOR', 'ADMIN']) && (
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Button as={Link} to="/create-course" variant="primary">
                  Create New Course
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {hasRole(['STUDENT']) && (
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Button as={Link} to="/courses" variant="primary">
                  Browse Courses
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {hasRole(['ADMIN']) && (
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Button as={Link} to="/admin" variant="success">
                  Admin Panel
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <h3>{hasRole(['STUDENT']) ? 'My Enrolled Courses' : 'My Courses'}</h3>
          {!Array.isArray(courses) || courses.length === 0 ? (
            <Alert variant="info">
              {hasRole(['STUDENT']) 
                ? 'You are not enrolled in any courses yet. ' 
                : 'You have not created any courses yet. '}
              <Alert.Link as={Link} to={hasRole(['STUDENT']) ? '/courses' : '/create-course'}>
                {hasRole(['STUDENT']) ? 'Browse available courses' : 'Create your first course'}
              </Alert.Link>
            </Alert>
          ) : (
            <Row>
              {courses.map(course => (
                <Col md={6} lg={4} key={course.id} className="mb-3">
                  <Card className="course-card">
                    <Card.Body>
                      <Card.Title>{course.title}</Card.Title>
                      <Card.Text>{course.description}</Card.Text>
                      <Card.Text>
                        <small className="text-muted">
                          Instructor: {course.instructor.firstName} {course.instructor.lastName}
                        </small>
                      </Card.Text>
                      <div className="d-grid gap-2">
                        <Button as={Link} to={`/course/${course.id}`} variant="primary">
                          View Course
                        </Button>
                        {hasRole(['INSTRUCTOR', 'ADMIN']) && (
                          <Button as={Link} to={`/edit-course/${course.id}`} variant="outline-secondary" size="sm">
                            Edit Course
                          </Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
