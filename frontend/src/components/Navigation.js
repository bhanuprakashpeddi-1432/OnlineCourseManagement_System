import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const initials = currentUser
    ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase()
    : '';

  const roleLabel = currentUser?.role
    ? currentUser.role.charAt(0) + currentUser.role.slice(1).toLowerCase()
    : '';

  return (
    <nav className="premium-navbar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Brand */}
        <Link to="/" className="navbar-brand-custom">
          🎓 LearnHub
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
            Home
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
            Courses
          </NavLink>
          {currentUser && (
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
          )}
          {hasRole(['INSTRUCTOR', 'ADMIN']) && (
            <NavLink to="/create-course" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              Create Course
            </NavLink>
          )}
          {hasRole(['ADMIN']) && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}>
              Admin
            </NavLink>
          )}
        </div>

        {/* User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                className="nav-user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="user-avatar">{initials}</div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{currentUser.firstName}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', background: 'rgba(139,92,246,0.15)', padding: '0.1rem 0.5rem', borderRadius: '20px' }}>
                  {roleLabel}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>▾</span>
              </button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)', minWidth: '180px', zIndex: 1001,
                  boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
                  animation: 'scaleIn 0.15s var(--ease-spring)'
                }}>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    📊 Dashboard
                  </Link>
                  <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.25rem 0' }} />
                  <button
                    onClick={handleLogout}
                    style={{ width: '100%', padding: '0.75rem 1rem', background: 'transparent', border: 'none', color: 'var(--color-danger)', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', textAlign: 'left' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-premium btn-ghost-premium" style={{ padding: '0.45rem 1.2rem', fontSize: '0.875rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-premium btn-primary-premium" style={{ padding: '0.45rem 1.2rem', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;