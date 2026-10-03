export type Role = 'ADMIN' | 'LEAD' | 'DEVELOPER';

export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  bio?: string;
  githubUsername?: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'OWNER' | 'MAINTAINER' | 'MEMBER';
  joinedAt: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  category: string;
  color: string;
  ownerId: string;
  owner?: User;
  members?: ProjectMember[];
  _count?: {
    tasks: number;
    issues: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  taskKey: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string; // JSON string or parsed array
  gitBranch?: string;
  dueDate?: string;
  estimatedHours?: number;
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  assignee?: User;
  creator?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  projectId: string;
  userId: string;
  taskId?: string;
  action: string;
  details: string;
  createdAt: string;
  user: User;
  task?: {
    id: string;
    taskKey: string;
    title: string;
  };
}

export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  totalEstimatedHours: number;
  statusCounts: Record<TaskStatus, number>;
  priorityCounts: Record<TaskPriority, number>;
  membersCount: number;
  issuesCount: number;
}
