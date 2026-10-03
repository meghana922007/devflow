import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjects();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('WEB');
  const [color, setColor] = useState('#6366f1');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key) return;

    setSubmitting(true);
    setError('');

    try {
      await createProject({
        name,
        key: key.toUpperCase().trim(),
        description,
        category,
        color,
      });
      setName('');
      setKey('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={20} color="#818cf8" /> Create New Engineering Project
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
            <label className="form-label">Project Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AI Workflow Engine"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key) {
                  // Auto suggest key
                  const autoKey = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 4).toUpperCase();
                  setKey(autoKey);
                }
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Project Key (Prefix for Task IDs) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AIWE"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="WEB">Web Application</option>
                <option value="MOBILE">Mobile App</option>
                <option value="BACKEND">Backend / API</option>
                <option value="INFRA">Infrastructure / DevOps</option>
                <option value="AI">AI / ML Model</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Summary of project goals and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Theme Color Accent</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8', '#a855f7'].map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: c,
                    cursor: 'pointer',
                    border: color === c ? '3px solid #fff' : '2px solid transparent',
                    boxShadow: color === c ? `0 0 12px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
