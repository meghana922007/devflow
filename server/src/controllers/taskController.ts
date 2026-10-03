import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { getIO } from '../socket/socketHandler';

export const getTasksByProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ tasks });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { projectId } = req.params;
    const { title, description, status, priority, tags, assigneeId, dueDate, gitBranch, estimatedHours } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Calculate auto-incrementing task key for this project (e.g., DF-1, DF-2)
    const taskCount = await prisma.task.count({ where: { projectId } });
    const taskKey = `${project.key}-${taskCount + 1}`;

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([]);

    const task = await prisma.task.create({
      data: {
        taskKey,
        title,
        description,
        status: status || 'TO_DO',
        priority: priority || 'MEDIUM',
        tags: tagsJson,
        gitBranch,
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 4.0,
        projectId,
        creatorId: userId,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Record Activity
    await prisma.activityLog.create({
      data: {
        projectId,
        userId,
        taskId: task.id,
        action: 'TASK_CREATED',
        details: `Created task ${task.taskKey}: "${task.title}"`,
      },
    });

    // Broadcast via Socket.IO
    try {
      const io = getIO();
      io.to(`project:${projectId}`).emit('task:created', task);
      io.to(`project:${projectId}`).emit('activity:new', {
        action: 'TASK_CREATED',
        message: `Task ${task.taskKey} created`,
        task,
      });
    } catch (e) {
      console.warn('Socket broadcast skipped or unavailable:', e);
    }

    return res.status(201).json({ task });
  } catch (error: any) {
    console.error('createTask error:', error);
    return res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const { title, description, status, priority, tags, assigneeId, dueDate, gitBranch, estimatedHours } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    const tagsJson = tags !== undefined
      ? (Array.isArray(tags) ? JSON.stringify(tags) : JSON.stringify([]))
      : existingTask.tags;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        status: status !== undefined ? status : existingTask.status,
        priority: priority !== undefined ? priority : existingTask.priority,
        tags: tagsJson,
        gitBranch: gitBranch !== undefined ? gitBranch : existingTask.gitBranch,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        estimatedHours: estimatedHours !== undefined ? parseFloat(estimatedHours) : existingTask.estimatedHours,
        assigneeId: assigneeId !== undefined ? (assigneeId || null) : existingTask.assigneeId,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    if (userId) {
      await prisma.activityLog.create({
        data: {
          projectId: existingTask.projectId,
          userId,
          taskId: id,
          action: 'TASK_UPDATED',
          details: `Updated task ${updatedTask.taskKey}`,
        },
      });
    }

    try {
      const io = getIO();
      io.to(`project:${existingTask.projectId}`).emit('task:updated', updatedTask);
    } catch (e) {
      console.warn('Socket update failed:', e);
    }

    return res.json({ task: updatedTask });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
};

export const moveTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    if (!status) return res.status(400).json({ message: 'Target status is required' });

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    const oldStatus = existingTask.status;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status },
      include: {
        assignee: { select: { id: true, name: true, email: true, avatar: true, role: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    if (userId) {
      await prisma.activityLog.create({
        data: {
          projectId: existingTask.projectId,
          userId,
          taskId: id,
          action: 'TASK_MOVED',
          details: `Moved ${updatedTask.taskKey} from ${oldStatus} to ${status}`,
        },
      });
    }

    try {
      const io = getIO();
      io.to(`project:${existingTask.projectId}`).emit('task:moved', {
        taskId: id,
        oldStatus,
        newStatus: status,
        task: updatedTask,
      });
    } catch (e) {
      console.warn('Socket broadcast failed:', e);
    }

    return res.json({ task: updatedTask });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to move task status', error: error.message });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await prisma.task.delete({ where: { id } });

    try {
      const io = getIO();
      io.to(`project:${task.projectId}`).emit('task:deleted', { taskId: id });
    } catch (e) {}

    return res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
};
