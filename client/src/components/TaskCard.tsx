import React from 'react';
import { Task, TaskStatus } from '../types';
import { GitBranch, Clock, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const STATUS_ORDER: TaskStatus[] = ['TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { moveTask, deleteTask } = useProjects();

  let tagsArray: string[] = [];
  try {
    tagsArray = typeof task.tags === 'string' ? JSON.parse(task.tags) : task.tags || [];
  } catch (e) {
    tagsArray = [];
  }

  const currentIndex = STATUS_ORDER.indexOf(task.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < STATUS_ORDER.length - 1;

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveLeft) {
      moveTask(task.id, STATUS_ORDER[currentIndex - 1]);
    }
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canMoveRight) {
      moveTask(task.id, STATUS_ORDER[currentIndex + 1]);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete task ${task.taskKey}?`)) {
      deleteTask(task.id);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEdit(task)}
    >
      <div className="task-card-header">
        <span className="task-key">{task.taskKey}</span>
        <span className={`priority-pill priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <div className="task-title">{task.title}</div>

      {task.gitBranch && (
        <div className="git-branch-badge">
          <GitBranch size={12} />
          <span>{task.gitBranch}</span>
        </div>
      )}

      {tagsArray.length > 0 && (
        <div className="task-tags">
          {tagsArray.map((tag, i) => (
            <span key={i} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="task-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {task.assignee ? (
            <img
              src={task.assignee.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${task.assignee.name}`}
              alt={task.assignee.name}
              className="assignee-avatar"
              title={`Assigned to ${task.assignee.name}`}
            />
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic' }}>Unassigned</div>
          )}

          {task.estimatedHours && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', color: '#9ca3af' }}>
              <Clock size={12} />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="quick-move-actions">
          {canMoveLeft && (
            <button className="action-icon-btn" onClick={handleMoveLeft} title="Move Left">
              <ChevronLeft size={14} />
            </button>
          )}
          {canMoveRight && (
            <button className="action-icon-btn" onClick={handleMoveRight} title="Move Right">
              <ChevronRight size={14} />
            </button>
          )}
          <button className="action-icon-btn" onClick={handleDelete} title="Delete Task">
            <Trash2 size={13} color="#9ca3af" />
          </button>
        </div>
      </div>
    </div>
  );
};
