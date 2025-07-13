import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseService } from '../services/api';

const Courses = () => {
  const { currentUser, hasRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = useCallback(async () => {
    try {
      let response;
      if (currentUser && hasRole(['STUDENT'])) {
        response = await courseService.getAvailableCourses();
      } else {
        response = await courseService.getAllCourses();
      }
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
  }, [currentUser, hasRole]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    // Filter courses based on search term - ensure courses is an array
    if (Array.isArray(courses)) {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${course.instructor.firstName} ${course.instructor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [courses, searchTerm]);

  const handleEnroll = async (courseId) => {
    try {
      await courseService.enrollInCourse(courseId);
      // Remove the course from available courses after enrollment
      setCourses(courses.filter(course => course.id !== courseId));
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert(error.response?.data || 'Failed to enroll in course');
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading courses...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>
            {currentUser && hasRole(['STUDENT']) ? 'Available Courses' : 'All Courses'}
          </h1>
          <p className="lead">
            {currentUser && hasRole(['STUDENT']) 
              ? 'Discover new courses to expand your knowledge'
              : 'Explore our course catalog'
            }
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {filteredCourses.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? 'No courses found matching your search criteria.'
            : currentUser && hasRole(['STUDENT'])
              ? 'No courses available for enrollment at the moment.'
              : 'No courses available at the moment.'
          }
        </Alert>
      ) : (
        <Row>
          {filteredCourses.map(course => (
            <Col md={6} lg={4} key={course.id} className="mb-4">
              <Card className="course-card h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{course.description}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Instructor: {course.instructor.firstName} {course.instructor.lastName}
                    </small>
                  </Card.Text>
                  <div className="mt-auto">
                    {currentUser ? (
                      <div className="d-grid gap-2">
                        <Button as={Link} to={`/course/${course.id}`} variant="outline-primary">
                          View Details
                        </Button>
                        {hasRole(['STUDENT']) && (
                          <Button 
                            onClick={() => handleEnroll(course.id)}
                            variant="primary"
                          >
                            Enroll Now
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="d-grid gap-2">
                        <Button as={Link} to="/login" variant="primary">
                          Login to Enroll
                        </Button>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Courses;
