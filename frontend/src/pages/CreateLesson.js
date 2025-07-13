import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonService } from '../services/api';

const CreateLesson = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
    setSuccess('');

    // Basic validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      setLoading(false);
      return;
    }

    try {
      const lessonData = {
        ...formData,
        order: formData.order ? parseInt(formData.order) : null
      };
      
      console.log('Creating lesson with data:', lessonData);
      console.log('Course ID:', courseId);
      
      const response = await lessonService.createLesson(courseId, lessonData);
      console.log('Lesson created successfully:', response.data);
      
      setSuccess('Lesson created successfully! Redirecting...');
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(`/course/${courseId}`);
      }, 1500);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Create New Lesson</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
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
                  <Form.Text className="text-muted">
                    Specify the order of this lesson in the course (e.g., 1, 2, 3...).
                  </Form.Text>
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
                  <Form.Text className="text-muted">
                    Provide a URL to an embedded video (YouTube, Vimeo, etc.).
                  </Form.Text>
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
                    {loading ? 'Creating Lesson...' : 'Create Lesson'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={() => navigate(`/course/${courseId}`)}
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

export default CreateLesson;
