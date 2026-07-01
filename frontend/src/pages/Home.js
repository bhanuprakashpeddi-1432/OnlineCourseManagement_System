import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const STATS = [
  { value: '10K+', label: 'Active Students' },
  { value: '500+', label: 'Courses Available' },
  { value: '200+', label: 'Expert Instructors' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const FEATURES = [
  {
    icon: '📚',
    title: 'Expert-Led Courses',
    desc: 'Learn from industry professionals with real-world experience. Our curated courses cover cutting-edge topics designed to accelerate your career.',
  },
  {
    icon: '🎯',
    title: 'Track Your Progress',
    desc: 'Stay motivated with detailed progress analytics. Mark lessons complete, track completion rates, and celebrate every milestone.',
  },
  {
    icon: '🚀',
    title: 'Learn at Your Pace',
    desc: 'No deadlines, no pressure. Access course materials anytime, anywhere and learn at a pace that works for your schedule.',
  },
  {
    icon: '🛡️',
    title: 'Role-Based Access',
    desc: 'Distinct experiences for Students, Instructors, and Admins. Every user gets exactly the tools they need, nothing more.',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    desc: 'Seamlessly switch between desktop and mobile. Your learning journey is always right there in your pocket.',
  },
  {
    icon: '🏆',
    title: 'Certificates',
    desc: 'Earn verifiable certificates upon course completion to showcase your newly acquired skills to the world.',
  },
];

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div style={{ marginLeft: '-1.5rem', marginRight: '-1.5rem', marginTop: '-2rem' }}>
      {/* ── Hero Section ── */}
      <section className="hero-section">
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">
            ✨ Next-Gen Learning Platform
          </div>
          <h1 className="hero-title">
            Learn Without
            <br />
            <span className="gradient-text">Limits.</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of courses taught by world-class instructors.
            Build real skills, earn certificates, and unlock your potential — all in one place.
          </p>
          <div className="hero-actions">
            {currentUser ? (
              <Link to="/dashboard" className="btn-premium btn-primary-premium" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                🚀 Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-premium btn-primary-premium" style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}>
                  🎓 Start Learning Free
                </Link>
                <Link to="/courses" className="btn-premium btn-ghost-premium" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                  Browse Courses →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <div style={{ padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        {/* ── Stats Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div className="page-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="page-title">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          <p className="page-subtitle">
            A complete learning ecosystem designed with students, instructors, and admins in mind.
          </p>
        </div>

        <div className="features-grid" style={{ marginBottom: '5rem' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* ── CTA Section ── */}
        {!currentUser && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
          }}>
            <h2 className="page-title" style={{ marginBottom: '1rem' }}>
              Ready to <span className="gradient-text">start your journey?</span>
            </h2>
            <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
              Join thousands of learners who are already building their future with LearnHub.
            </p>
            <Link to="/register" className="btn-premium btn-primary-premium" style={{ padding: '1rem 3rem', fontSize: '1rem' }}>
              🎉 Create Free Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;