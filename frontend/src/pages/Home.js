import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Container>
      <Row className="mb-5">
        <Col lg={8} className="mx-auto text-center">
          <h1 className="display-4 mb-4">Welcome to Online Course Management</h1>
          <p className="lead mb-4">
            Discover, learn, and grow with our comprehensive online learning platform.
            Whether you're a student looking to expand your knowledge or an instructor
            ready to share your expertise, we have something for everyone.
          </p>
          {!currentUser ? (
            <div>
              <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
                Get Started
              </Button>
              <Button as={Link} to="/courses" variant="outline-primary" size="lg">
                Browse Courses
              </Button>
            </div>
          ) : (
            <Button as={Link} to="/dashboard" variant="primary" size="lg">
              Go to Dashboard
            </Button>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>📚 Learn</h3>
              <p>
                Access high-quality courses created by expert instructors.
                Track your progress and achieve your learning goals.
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>🎓 Teach</h3>
              <p>
                Share your knowledge with learners worldwide. Create engaging
                courses and help others achieve their potential.
              </p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>📈 Grow</h3>
              <p>
                Monitor your learning journey with detailed progress tracking
                and certificates of completion.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {!currentUser && (
        <Row className="mt-5">
          <Col lg={8} className="mx-auto text-center">
            <h2>Ready to Start Learning?</h2>
            <p className="mb-4">
              Join thousands of learners and instructors in our growing community.
            </p>
            <Button as={Link} to="/register" variant="success" size="lg">
              Sign Up Now
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;
