import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, demoLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password, role, githubUsername);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(demoEmail);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#818cf8" />
            {isRegisterMode ? 'Create DevFlow Account' : 'Welcome Back to DevFlow'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', background: 'rgba(244,63,94,0.15)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Quick Demo Login Bar */}
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> ONE-CLICK DEMO LOGIN FOR TESTING:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo('alex@devflow.io')}
            >
              👑 Alex (Lead Admin)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleQuickDemo('meghana@devflow.io')}
            >
              🚀 Meghana (Lead Dev)
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.78rem', margin: '4px 0' }}>— OR ENTER CREDENTIALS —</div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Jane Architect"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="developer@company.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegisterMode && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="DEVELOPER">Developer</option>
                  <option value="LEAD">Tech Lead</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">GitHub Handle</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="octocat"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? 'Authenticating...' : isRegisterMode ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.82rem', color: '#9ca3af' }}>
          {isRegisterMode ? 'Already have an account? ' : "Don't have an account yet? "}
          <span
            style={{ color: '#818cf8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? 'Sign In' : 'Register Here'}
          </span>
        </div>
      </div>
    </div>
  );
};
