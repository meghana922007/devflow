import React, { useState } from 'react';
import { TaskStatus, Task } from '../types';
import { TaskCard } from './TaskCard';
import { useProjects } from '../context/ProjectContext';
import { CircleCheck, CircleDashed, Clock, CheckCircle2, Filter, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  color: string;
  icon: React.ReactNode;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'TO_DO', title: 'To Do', color: '#38bdf8', icon: <CircleDashed size={16} color="#38bdf8" /> },
  { id: 'IN_PROGRESS', title: 'In Progress', color: '#f59e0b', icon: <Clock size={16} color="#f59e0b" /> },
  { id: 'IN_REVIEW', title: 'In Review', color: '#a855f7', icon: <AlertCircle size={16} color="#a855f7" /> },
  { id: 'DONE', title: 'Done', color: '#10b981', icon: <CheckCircle2 size={16} color="#10b981" /> },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask }) => {
  const {
    tasks,
    tasksLoading,
    moveTask,
    searchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    users,
  } = useProjects();

  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchKey = t.taskKey.toLowerCase().includes(q);
      const matchBranch = t.gitBranch?.toLowerCase().includes(q);
      if (!matchTitle && !matchKey && !matchBranch) return false;
    }

    // Priority filter match
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) {
      return false;
    }

    // Assignee filter match
    if (assigneeFilter !== 'ALL' && t.assigneeId !== assigneeFilter) {
      return false;
    }

    return true;
  });

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) setDragOverCol(colId);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, targetStatus);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      {/* Filter Controls Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600 }}>
            <Filter size={14} /> Filter Tasks:
          </div>

          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">🔴 Urgent</option>
            <option value="HIGH">🟠 High</option>
            <option value="MEDIUM">🔵 Medium</option>
            <option value="LOW">⚪ Low</option>
          </select>

          <select
            className="filter-select"
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
          >
            <option value="ALL">All Assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                👤 {u.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
          Showing <strong style={{ color: '#fff' }}>{filteredTasks.length}</strong> of {tasks.length} tasks
        </div>
      </div>

      {/* Columns Grid */}
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const isOver = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              className={`kanban-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                <div className="column-title">
                  {col.icon}
                  <span>{col.title}</span>
                </div>
                <span className="badge-count" style={{ borderColor: col.color }}>
                  {colTasks.length}
                </span>
              </div>

              <div className="column-tasks-container">
                {tasksLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '0.85rem' }}>
                    Loading tasks...
                  </div>
                ) : colTasks.length === 0 ? (
                  <div
                    style={{
                      border: '2px dashed rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      padding: '30px 14px',
                      textAlign: 'center',
                      color: '#6b7280',
                      fontSize: '0.82rem',
                    }}
                  >
                    Drop tasks here
                  </div>
                ) : (
                  colTasks.map((t) => <TaskCard key={t.id} task={t} onEdit={onEditTask} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
