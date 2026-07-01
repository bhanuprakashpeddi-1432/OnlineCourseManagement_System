import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLES = [
  { value: 'STUDENT',    emoji: '📚', label: 'Student' },
  { value: 'INSTRUCTOR', emoji: '🎓', label: 'Instructor' },
  { value: 'ADMIN',      emoji: '⚡', label: 'Admin' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 60%), var(--color-bg)',
      padding: '2rem 1rem',
      marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem',
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }} className="scale-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✨</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join LearnHub and start your learning journey today
          </p>
        </div>

        <div className="form-premium">
          {error && (
            <div className="alert-premium alert-danger-premium" style={{ marginBottom: '1.5rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group-premium">
                <label className="form-label-premium">First Name</label>
                <input
                  type="text" name="firstName" className="form-control-premium"
                  placeholder="Jane" value={formData.firstName}
                  onChange={handleChange} required
                />
              </div>
              <div className="form-group-premium">
                <label className="form-label-premium">Last Name</label>
                <input
                  type="text" name="lastName" className="form-control-premium"
                  placeholder="Doe" value={formData.lastName}
                  onChange={handleChange} required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label className="form-label-premium">Email Address</label>
              <input
                type="email" name="email" className="form-control-premium"
                placeholder="you@example.com" value={formData.email}
                onChange={handleChange} required
              />
            </div>

            <div className="form-group-premium">
              <label className="form-label-premium">Password</label>
              <input
                type="password" name="password" className="form-control-premium"
                placeholder="Minimum 6 characters" value={formData.password}
                onChange={handleChange} required
              />
            </div>

            {/* Role Selector */}
            <div className="form-group-premium">
              <label className="form-label-premium">I am joining as</label>
              <div className="role-cards">
                {ROLES.map((r) => (
                  <div
                    key={r.value}
                    className={`role-card ${formData.role === r.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, role: r.value })}
                  >
                    <span className="role-emoji">{r.emoji}</span>
                    <span className="role-name">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-premium btn-primary-premium"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <div className="spinner-ring" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                  Creating account...
                </>
              ) : (
                '🎉 Create Account'
              )}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;