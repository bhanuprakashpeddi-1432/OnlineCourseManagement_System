import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminService.getAllUsers();
        setUsers(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(users); return; }
    const q = search.toLowerCase();
    setFiltered(users.filter(u =>
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const handleToggle = async (userId) => {
    setTogglingId(userId);
    try {
      const res = await adminService.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, enabled: res.data.enabled } : u));
    } catch (err) {
      alert('Failed to update user status.');
    } finally {
      setTogglingId(null);
    }
  };

  const stats = [
    { icon: '👥', label: 'Total Users', value: users.length, iconClass: 'stat-icon-purple' },
    { icon: '📚', label: 'Students', value: users.filter(u => u.role === 'STUDENT').length, iconClass: 'stat-icon-cyan' },
    { icon: '🎓', label: 'Instructors', value: users.filter(u => u.role === 'INSTRUCTOR').length, iconClass: 'stat-icon-green' },
    { icon: '✅', label: 'Active Users', value: users.filter(u => u.enabled).length, iconClass: 'stat-icon-amber' },
  ];

  const roleColors = {
    ADMIN: 'badge-danger',
    INSTRUCTOR: 'badge-purple',
    STUDENT: 'badge-cyan',
  };

  const initials = (u) => `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="fade-in-up">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="page-subtitle">Manage users, monitor platform activity</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.iconClass}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            👥 All Users
          </h2>
          <div className="search-container" style={{ maxWidth: '300px' }}>
            <span className="search-icon">🔍</span>
            <input
              type="text" className="search-input"
              placeholder="Search users..."
              value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="spinner-premium">
            <div className="spinner-ring" />
            <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '2rem' }}>
            <div className="alert-premium alert-danger-premium">{error}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-premium">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                          {initials(user)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td>
                      <span className={`badge-premium ${roleColors[user.role] || 'badge-purple'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-premium ${user.enabled ? 'badge-success' : 'badge-danger'}`}>
                        {user.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggle(user.id)}
                        disabled={togglingId === user.id}
                        className={`btn-premium ${user.enabled ? 'btn-danger-premium' : ''}`}
                        style={{
                          padding: '0.35rem 0.9rem',
                          fontSize: '0.8rem',
                          background: !user.enabled ? 'rgba(16,185,129,0.15)' : undefined,
                          color: !user.enabled ? 'var(--color-success)' : undefined,
                          border: !user.enabled ? '1px solid rgba(16,185,129,0.3)' : undefined,
                          opacity: togglingId === user.id ? 0.6 : 1,
                        }}
                      >
                        {togglingId === user.id ? '...' : user.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="empty-state" style={{ padding: '3rem 2rem' }}>
                <div className="empty-state-icon">🔭</div>
                <div className="empty-state-title">No users found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;