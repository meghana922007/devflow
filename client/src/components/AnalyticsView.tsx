import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { CheckCircle2, Clock, ListTodo, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { analytics, activeProject, activities } = useProjects();

  if (!analytics || !activeProject) {
    return <div style={{ color: '#9ca3af', padding: '20px' }}>Loading project analytics...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem' }}>{activeProject.name} Dashboard & Analytics</h2>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '4px' }}>
            Real-time project overview, workflow progress, and dev activity.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(16,185,129,0.3)', fontWeight: 600, fontSize: '0.85rem' }}>
          <TrendingUp size={16} /> {analytics.completionRate}% Completion Rate
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="analytics-grid">
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Tasks</span>
            <ListTodo size={18} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#fff' }}>{analytics.totalTasks}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Active engineering work items</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tasks Completed</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#10b981' }}>{analytics.completedTasks}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Merged & finished tasks</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Est. Engineering Hours</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#f59e0b' }}>{analytics.totalEstimatedHours} hrs</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Across all task estimates</div>
        </div>

        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#9ca3af' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Team Members</span>
            <Users size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '8px', color: '#38bdf8' }}>{analytics.membersCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>Collaborating on project</div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
          <span>Overall Project Progress</span>
          <span style={{ color: '#818cf8' }}>{analytics.completionRate}% Done</span>
        </div>
        <div style={{ width: '100%', height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
          <div
            style={{
              width: `${analytics.completionRate}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              borderRadius: 6,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Grid for Priority Breakdown & Activity Log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Status Breakdown */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Task Status Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#38bdf8' }}>To Do</span>
                <span>{analytics.statusCounts.TO_DO}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <div style={{ width: `${(analytics.statusCounts.TO_DO / (analytics.totalTasks || 1)) * 100}%`, height: '100%', background: '#38bdf8', borderRadius: 3 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#f59e0b' }}>In Progress</span>
                <span>{analytics.statusCounts.IN_PROGRESS}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <div style={{ width: `${(analytics.statusCounts.IN_PROGRESS / (analytics.totalTasks || 1)) * 100}%`, height: '100%', background: '#f59e0b', borderRadius: 3 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#a855f7' }}>In Review</span>
                <span>{analytics.statusCounts.IN_REVIEW}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <div style={{ width: `${(analytics.statusCounts.IN_REVIEW / (analytics.totalTasks || 1)) * 100}%`, height: '100%', background: '#a855f7', borderRadius: 3 }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span style={{ color: '#10b981' }}>Done</span>
                <span>{analytics.statusCounts.DONE}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                <div style={{ width: `${(analytics.statusCounts.DONE / (analytics.totalTasks || 1)) * 100}%`, height: '100%', background: '#10b981', borderRadius: 3 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '16px' }}>Priority Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ color: '#f43f5e', fontSize: '0.8rem', fontWeight: 700 }}>🔴 URGENT</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>{analytics.priorityCounts.URGENT}</div>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700 }}>🟠 HIGH</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>{analytics.priorityCounts.HIGH}</div>
            </div>

            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ color: '#818cf8', fontSize: '0.8rem', fontWeight: 700 }}>🔵 MEDIUM</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>{analytics.priorityCounts.MEDIUM}</div>
            </div>

            <div style={{ background: 'rgba(156,163,175,0.1)', border: '1px solid rgba(156,163,175,0.2)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', fontWeight: 700 }}>⚪ LOW</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>{analytics.priorityCounts.LOW}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Feed */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#818cf8" /> Recent Activity Stream
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activities.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>No activities recorded yet.</div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                }}
              >
                <img
                  src={act.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${act.user?.name}`}
                  alt={act.user?.name}
                  style={{ width: 28, height: 28, borderRadius: '50%' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{act.user?.name || 'User'}</span>{' '}
                  <span style={{ color: '#d1d5db' }}>{act.details}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                  {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
