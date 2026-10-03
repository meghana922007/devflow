import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { X, Save, Plus, GitBranch, Clock, UserCheck, Tag } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { createTask, updateTask, users } = useProjects();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TO_DO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [gitBranch, setGitBranch] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('4.0');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setAssigneeId(taskToEdit.assigneeId || '');
      setGitBranch(taskToEdit.gitBranch || '');
      setEstimatedHours(taskToEdit.estimatedHours ? taskToEdit.estimatedHours.toString() : '4.0');

      try {
        const parsed = typeof taskToEdit.tags === 'string' ? JSON.parse(taskToEdit.tags) : taskToEdit.tags;
        setTagsInput(Array.isArray(parsed) ? parsed.join(', ') : '');
      } catch (e) {
        setTagsInput('');
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus('TO_DO');
      setPriority('MEDIUM');
      setAssigneeId('');
      setGitBranch('');
      setTagsInput('');
      setEstimatedHours('4.0');
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const tagsArray = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0);

      const payload = {
        title,
        description,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        gitBranch: gitBranch ? gitBranch.trim() : undefined,
        tags: JSON.stringify(tagsArray),
        estimatedHours: parseFloat(estimatedHours) || 4.0,
      };

      if (taskToEdit) {
        await updateTask(taskToEdit.id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } catch (error) {
      console.error('Task submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {taskToEdit ? `Edit Task ${taskToEdit.taskKey}` : 'Create New Kanban Task'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Implement Socket.IO real-time event broadcasting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Acceptance Criteria</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide context, acceptance criteria or steps to verify..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Workflow Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent Priority</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select className="form-select" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">-- Unassigned --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Git Branch (e.g., feature/socket-sync)</label>
              <input
                type="text"
                className="form-input"
                placeholder="feature/branch-name"
                value={gitBranch}
                onChange={(e) => setGitBranch(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="frontend, auth, security"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
