import React, { useState } from 'react';
import { Layers, Plus, Search, Radio, UserCheck, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useSocket } from '../context/SocketContext';

interface NavbarProps {
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onOpenAuthModal,
}) => {
  const { user, logout, demoLogin } = useAuth();
  const { projects, activeProject, setActiveProject, searchQuery, setSearchQuery } = useProjects();
  const { isConnected } = useSocket();

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="navbar">
      {/* Brand Logo */}
      <div className="brand">
        <div className="brand-icon">
          <Layers size={20} color="#fff" />
        </div>
        <span>
          Dev<span className="gradient-text">Flow</span>
        </span>
        <span style={{ fontSize: '0.7rem', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.3)' }}>
          MODULE 1
        </span>
      </div>

      {/* Project Selector Dropdown */}
      {user && (
        <div style={{ position: 'relative' }}>
          <div className="project-selector" onClick={() => setShowProjectDropdown(!showProjectDropdown)}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: activeProject?.color || '#6366f1' }} />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {activeProject ? `${activeProject.name} (${activeProject.key})` : 'Select Project'}
            </span>
            <ChevronDown size={14} color="#9ca3af" />
          </div>

          {showProjectDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '46px',
                left: 0,
                width: '260px',
                padding: '8px',
                zIndex: 60,
                background: '#111827',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280', padding: '6px 10px', textTransform: 'uppercase', fontWeight: 700 }}>
                Your Projects ({projects.length})
              </div>
              {projects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setActiveProject(p);
                    setShowProjectDropdown(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: activeProject?.id === p.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: activeProject?.id === p.id ? '#818cf8' : '#e5e7eb',
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Key: {p.key}</div>
                  </div>
                </div>
              ))}
              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '8px' }}
                onClick={() => {
                  setShowProjectDropdown(false);
                  onOpenNewProjectModal();
                }}
              >
                <Plus size={14} /> Create New Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* Global Search */}
      <div className="search-input-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title, key or branch..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Real-time Socket Indicator */}
        <div
          title={isConnected ? 'Connected to Socket.IO live sync' : 'Connecting to socket server...'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: isConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: isConnected ? '#10b981' : '#f59e0b',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
          }}
        >
          <Radio size={12} className={isConnected ? 'animate-pulse' : ''} />
          <span>{isConnected ? 'LIVE SYNC' : 'OFFLINE'}</span>
        </div>

        {user && (
          <button className="btn btn-primary btn-sm" onClick={onOpenNewTaskModal}>
            <Plus size={16} /> New Task
          </button>
        )}

        {/* User Account / Auth button */}
        {user ? (
          <div style={{ position: 'relative' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
            >
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                alt={user.name}
                style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
              />
            </div>

            {showUserDropdown && (
              <div
                className="glass-panel"
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '240px',
                  padding: '12px',
                  zIndex: 60,
                  background: '#111827',
                }}
              >
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{user.email}</div>
                  <div style={{ marginTop: '4px', fontSize: '0.7rem', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', display: 'inline-block', padding: '2px 6px', borderRadius: '4px' }}>
                    {user.role}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px', fontWeight: 600 }}>SWITCH DEMO ACCOUNT</div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '6px' }}
                  onClick={() => {
                    demoLogin('alex@devflow.io');
                    setShowUserDropdown(false);
                  }}
                >
                  <UserCheck size={14} color="#38bdf8" /> Alex Rivers (Admin)
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '10px' }}
                  onClick={() => {
                    demoLogin('meghana@devflow.io');
                    setShowUserDropdown(false);
                  }}
                >
                  <UserCheck size={14} color="#10b981" /> Meghana Dev (Lead)
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%' }}
                  onClick={() => {
                    logout();
                    setShowUserDropdown(false);
                  }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuthModal}>
            <Sparkles size={16} /> Sign In / Demo
          </button>
        )}
      </div>
    </header>
  );
};
