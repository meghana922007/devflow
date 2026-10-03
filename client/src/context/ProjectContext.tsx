import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Task, User, AnalyticsData, ActivityLog } from '../types';
import { fetchApi } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

interface NotificationToast {
  id: string;
  type: 'info' | 'success' | 'warning';
  message: string;
  timestamp: string;
}

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  tasks: Task[];
  users: User[];
  analytics: AnalyticsData | null;
  activities: ActivityLog[];
  notifications: NotificationToast[];
  loading: boolean;
  tasksLoading: boolean;
  searchQuery: string;
  priorityFilter: string;
  assigneeFilter: string;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: string) => void;
  setAssigneeFilter: (assigneeId: string) => void;
  setActiveProject: (project: Project) => void;
  fetchProjects: () => Promise<void>;
  fetchTasks: (projectId: string) => Promise<void>;
  fetchAnalytics: (projectId: string) => Promise<void>;
  createProject: (data: { name: string; key: string; description?: string; category?: string; color?: string }) => Promise<Project>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<Task>;
  moveTask: (taskId: string, targetStatus: string) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  addMember: (projectId: string, userEmail: string, role?: string) => Promise<void>;
  removeNotification: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { socket, joinProjectRoom, leaveProjectRoom } = useSocket();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [tasksLoading, setTasksLoading] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  const addToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newToast: NotificationToast = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [newToast, ...prev.slice(0, 4)]);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const fetchUsers = async () => {
    try {
      const data = await fetchApi('/users');
      setUsers(data.users || []);
    } catch (e) {
      console.error('Fetch users error:', e);
    }
  };

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchApi('/projects');
      const fetchedProjects: Project[] = data.projects || [];
      setProjects(fetchedProjects);

      if (fetchedProjects.length > 0 && !activeProject) {
        setActiveProjectState(fetchedProjects[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, [user, activeProject]);

  const fetchTasks = useCallback(async (projectId: string) => {
    setTasksLoading(true);
    try {
      const data = await fetchApi(`/projects/${projectId}/tasks`);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async (projectId: string) => {
    try {
      const data = await fetchApi(`/projects/${projectId}/analytics`);
      setAnalytics(data.analytics || null);
      setActivities(data.recentActivities || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, []);

  const setActiveProject = (project: Project) => {
    if (activeProject && activeProject.id !== project.id) {
      leaveProjectRoom(activeProject.id);
    }
    setActiveProjectState(project);
    joinProjectRoom(project.id);
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchUsers();
    }
  }, [user, fetchProjects]);

  // Load tasks & analytics when active project changes
  useEffect(() => {
    if (activeProject) {
      joinProjectRoom(activeProject.id);
      fetchTasks(activeProject.id);
      fetchAnalytics(activeProject.id);
    }
  }, [activeProject, fetchTasks, fetchAnalytics, joinProjectRoom]);

  // Listen to Socket.IO real-time updates!
  useEffect(() => {
    if (!socket || !activeProject) return;

    const handleTaskCreated = (newTask: Task) => {
      if (newTask.projectId === activeProject.id) {
        setTasks((prev) => [newTask, ...prev.filter((t) => t.id !== newTask.id)]);
        fetchAnalytics(activeProject.id);
        addToast(`New task created: ${newTask.taskKey}`, 'info');
      }
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      if (updatedTask.projectId === activeProject.id) {
        setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
        fetchAnalytics(activeProject.id);
      }
    };

    const handleTaskMoved = (data: { taskId: string; oldStatus: string; newStatus: string; task: Task }) => {
      if (data.task.projectId === activeProject.id) {
        setTasks((prev) => prev.map((t) => (t.id === data.taskId ? data.task : t)));
        fetchAnalytics(activeProject.id);
        addToast(`Task ${data.task.taskKey} moved to ${data.newStatus.replace('_', ' ')}`, 'success');
      }
    };

    const handleTaskDeleted = (data: { taskId: string }) => {
      setTasks((prev) => prev.filter((t) => t.id !== data.taskId));
      if (activeProject) fetchAnalytics(activeProject.id);
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:moved', handleTaskMoved);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:moved', handleTaskMoved);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [socket, activeProject, fetchAnalytics, addToast]);

  const createProject = async (data: { name: string; key: string; description?: string; category?: string; color?: string }) => {
    const res = await fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const newProject = res.project;
    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    addToast(`Project ${newProject.name} created!`, 'success');
    return newProject;
  };

  const createTask = async (data: Partial<Task>) => {
    if (!activeProject) throw new Error('No active project selected');

    const res = await fetchApi(`/projects/${activeProject.id}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const newTask = res.task;
    setTasks((prev) => [newTask, ...prev]);
    fetchAnalytics(activeProject.id);
    addToast(`Created task ${newTask.taskKey}`, 'success');
    return newTask;
  };

  const updateTask = async (taskId: string, data: Partial<Task>) => {
    const res = await fetchApi(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const updated = res.task;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (activeProject) fetchAnalytics(activeProject.id);
    return updated;
  };

  const moveTask = async (taskId: string, targetStatus: string) => {
    // Optimistic UI update for fluid response
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus as any } : t)));

    const res = await fetchApi(`/tasks/${taskId}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ status: targetStatus }),
    });

    const updated = res.task;
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    if (activeProject) fetchAnalytics(activeProject.id);
    return updated;
  };

  const deleteTask = async (taskId: string) => {
    await fetchApi(`/tasks/${taskId}`, { method: 'DELETE' });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeProject) fetchAnalytics(activeProject.id);
    addToast('Task deleted', 'warning');
  };

  const addMember = async (projectId: string, userEmail: string, role?: string) => {
    await fetchApi(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userEmail, role }),
    });
    fetchProjects();
    addToast(`Added member ${userEmail}`, 'success');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        tasks,
        users,
        analytics,
        activities,
        notifications,
        loading,
        tasksLoading,
        searchQuery,
        priorityFilter,
        assigneeFilter,
        setSearchQuery,
        setPriorityFilter,
        setAssigneeFilter,
        setActiveProject,
        fetchProjects,
        fetchTasks,
        fetchAnalytics,
        createProject,
        createTask,
        updateTask,
        moveTask,
        deleteTask,
        addMember,
        removeNotification,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
};
