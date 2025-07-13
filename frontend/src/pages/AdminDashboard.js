import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminService.toggleUserStatus(userId);
      // Refresh users list
      fetchUsers();
    } catch (error) {
      alert('Failed to toggle user status');
    }
  };

  const getUserRoleBadge = (role) => {
    const variants = {
      ADMIN: 'danger',
      INSTRUCTOR: 'primary',
      STUDENT: 'success'
    };
    return <Badge bg={variants[role]}>{role}</Badge>;
  };

  const getStatusBadge = (enabled) => {
    return (
      <Badge bg={enabled ? 'success' : 'secondary'}>
        {enabled ? 'Active' : 'Disabled'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading admin dashboard...</p>
        </div>
      </Container>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
    students: users.filter(u => u.role === 'STUDENT').length,
    active: users.filter(u => u.enabled).length
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Admin Dashboard</h1>
          <p className="lead">Manage users and monitor platform activity</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <p>Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.students}</h3>
              <p>Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats.instructors}</h3>
              <p>Instructors</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-warning">{stats.admins}</h3>
              <p>Admins</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Users Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>All Users</h4>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.firstName} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{getUserRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.enabled)}</td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant={user.enabled ? 'outline-danger' : 'outline-success'}
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {users.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No users found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
