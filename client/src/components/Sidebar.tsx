import React from 'react';
import { Kanban, BarChart3, Users, Activity, GitBranch, ShieldCheck } from 'lucide-react';

export type ActiveTab = 'kanban' | 'analytics' | 'team' | 'activity' | 'github_preview';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div>
        <div className="nav-section-title">Workflow Views</div>
        <div
          className={`nav-item ${activeTab === 'kanban' ? 'active' : ''}`}
          onClick={() => setActiveTab('kanban')}
        >
          <Kanban size={18} />
          <span>Kanban Board</span>
        </div>

        <div
          className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 size={18} />
          <span>Analytics</span>
        </div>

        <div
          className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={18} />
          <span>Team Members</span>
        </div>

        <div
          className={`nav-item ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity size={18} />
          <span>Activity Log</span>
        </div>
      </div>

      <div>
        <div className="nav-section-title">Integrations</div>
        <div
          className={`nav-item ${activeTab === 'github_preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('github_preview')}
        >
          <GitBranch size={18} />
          <span>GitHub & CI/CD</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.65rem', background: 'rgba(56,189,248,0.2)', color: '#38bdf8', padding: '1px 5px', borderRadius: '4px' }}>
            NEXT
          </span>
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 600, color: '#e5e7eb' }}>
          <ShieldCheck size={16} color="#10b981" /> DevFlow Security
        </div>
        <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '4px' }}>
          JWT Bearer Auth • SQLite & Prisma ORM • Realtime WebSockets
        </div>
      </div>
    </aside>
  );
};
