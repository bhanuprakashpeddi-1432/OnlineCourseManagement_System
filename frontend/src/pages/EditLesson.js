import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/api';

const EditLesson = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLesson = useCallback(async () => {
    try {
      const response = await lessonService.getLessonById(id);
      const lesson = response.data;
      if (lesson) {
        setFormData({
          title: lesson.title || '',
          content: lesson.content || '',
          videoUrl: lesson.videoUrl || '',
          order: lesson.order || ''
        });
        setError('');
      } else {
        setError('Lesson not found');
      }
    } catch (error) {
      console.error('Failed to fetch lesson details:', error);
      setError('Failed to fetch lesson details. Please try again later.');
    } finally {
      setFetchLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const lessonData = {
        ...formData,
        order: formData.order ? parseInt(formData.order) : null
      };
      
      console.log('Updating lesson with data:', lessonData);
      const response = await lessonService.updateLesson(id, lessonData);
      console.log('Lesson updated successfully:', response.data);
      navigate(`/lesson/${id}`);
    } catch (error) {
      console.error('Failed to update lesson:', error);
      setError(error.response?.data?.message || error.message || 'Failed to update lesson');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading lesson details...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Edit Lesson</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Lesson Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Lesson Order (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="1"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Video URL (Optional)</Form.Label>
                  <Form.Control
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/video"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Lesson Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter the lesson content, instructions, or description..."
                  />
                </Form.Group>
                
                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating Lesson...' : 'Update Lesson'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate(`/lesson/${id}`)}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditLesson;
