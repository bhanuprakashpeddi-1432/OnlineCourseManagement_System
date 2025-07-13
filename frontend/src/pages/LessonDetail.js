import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessonService } from '../services/api';

const LessonDetail = () => {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLessonDetails = useCallback(async () => {
    try {
      const response = await lessonService.getLessonById(id);
      setLesson(response.data);
      setError('');
    } catch (error) {
      console.error('Failed to fetch lesson details:', error);
      setError('Failed to fetch lesson details. Please try again later.');
      setLesson(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLessonDetails();
  }, [fetchLessonDetails]);

  const handleMarkComplete = async () => {
    try {
      await lessonService.markLessonComplete(id);
      alert('Lesson marked as completed!');
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error);
      alert(error.response?.data?.message || 'Failed to mark lesson as completed');
    }
  };

  const handleDeleteLesson = async () => {
    if (window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      try {
        await lessonService.deleteLesson(id);
        alert('Lesson deleted successfully');
        navigate(`/course/${lesson.courseId}`);
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        alert(error.response?.data?.message || 'Failed to delete lesson');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading lesson...</p>
        </div>
      </Container>
    );
  }

  if (error || !lesson) {
    return (
      <Container>
        <Alert variant="danger">{error || 'Lesson not found'}</Alert>
      </Container>
    );
  }

  const isInstructor = hasRole(['INSTRUCTOR', 'ADMIN']);

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={`/course/${lesson.courseId}`}>{lesson.courseTitle}</Link>
                  </li>
                  <li className="breadcrumb-item active">{lesson.title}</li>
                </ol>
              </nav>
              <h1>{lesson.title}</h1>
            </div>
            <div>
              {isInstructor && (
                <div className="d-grid gap-2">
                  <Button as={Link} to={`/edit-lesson/${lesson.id}`} variant="outline-primary">
                    Edit Lesson
                  </Button>
                  <Button onClick={handleDeleteLesson} variant="danger">
                    Delete Lesson
                  </Button>
                </div>
              )}
              
              {hasRole(['STUDENT']) && (
                <Button onClick={handleMarkComplete} variant="success">
                  Mark as Complete
                </Button>
              )}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              {lesson.videoUrl && (
                <div className="mb-4">
                  <h5>Video Content</h5>
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={lesson.videoUrl}
                      title={lesson.title}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
              
              {lesson.content && (
                <div>
                  <h5>Lesson Content</h5>
                  <div className="lesson-content">
                    {lesson.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              
              {!lesson.content && !lesson.videoUrl && (
                <Alert variant="info">
                  This lesson doesn't have any content yet.
                  {isInstructor && (
                    <> <Alert.Link as={Link} to={`/edit-lesson/${lesson.id}`}>
                      Add content to this lesson
                    </Alert.Link></>
                  )}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Header>
              <h6>Course Information</h6>
            </Card.Header>
            <Card.Body>
              <h6>{lesson.courseTitle}</h6>
              <div className="d-grid">
                <Button as={Link} to={`/course/${lesson.courseId}`} variant="outline-primary">
                  Back to Course
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LessonDetail;
