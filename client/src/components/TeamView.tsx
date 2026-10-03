import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { UserPlus, Shield, Github, Mail, UserCheck } from 'lucide-react';

interface TeamViewProps {
  onOpenAddMemberModal: () => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onOpenAddMemberModal }) => {
  const { activeProject } = useProjects();

  if (!activeProject) return null;

  const members = activeProject.members || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>{activeProject.name} Team Roster</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Manage project contributors, roles, and permissions.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAddMemberModal}>
          <UserPlus size={16} /> Add Team Member
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {members.map((m) => (
          <div key={m.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={m.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.user?.name}`}
                alt={m.user?.name}
                style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{m.user?.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={12} /> {m.user?.email}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', background: m.role === 'OWNER' ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.2)', color: m.role === 'OWNER' ? '#f59e0b' : '#818cf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                {m.role}
              </span>

              {m.user?.githubUsername && (
                <a
                  href={`https://github.com/${m.user.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none' }}
                >
                  <Github size={12} /> @{m.user.githubUsername}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
