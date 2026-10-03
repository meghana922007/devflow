import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
  const { activeProject, addMember, users } = useProjects();
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !activeProject) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserEmail) return;

    setSubmitting(true);
    setError('');

    try {
      await addMember(activeProject.id, selectedUserEmail, role);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#10b981" /> Add Member to {activeProject.name}
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Select Registered User</label>
            <select
              className="form-select"
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              required
            >
              <option value="">-- Choose User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.email}>
                  {u.name} ({u.email}) - {u.role}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="MEMBER">Member (Can create, edit & move tasks)</option>
              <option value="MAINTAINER">Maintainer (Can manage settings & team)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
