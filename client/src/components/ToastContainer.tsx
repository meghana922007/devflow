import React from 'react';
import { useProjects } from '../context/ProjectContext';
import { Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useProjects();

  if (notifications.length === 0) return null;

  return (
    <div className="toast-container">
      {notifications.map((n) => (
        <div key={n.id} className="toast">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {n.type === 'success' ? (
              <CheckCircle size={16} color="#10b981" />
            ) : n.type === 'warning' ? (
              <AlertTriangle size={16} color="#f59e0b" />
            ) : (
              <Info size={16} color="#38bdf8" />
            )}
            <span style={{ fontSize: '0.85rem', color: '#f3f4f6', fontWeight: 500 }}>{n.message}</span>
          </div>

          <button
            onClick={() => removeNotification(n.id)}
            style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
