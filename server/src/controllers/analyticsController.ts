import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getProjectAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        _count: {
          select: { tasks: true, issues: true, members: true },
        },
      },
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { id: true, status: true, priority: true, estimatedHours: true },
    });

    const statusCounts = {
      TO_DO: 0,
      IN_PROGRESS: 0,
      IN_REVIEW: 0,
      DONE: 0,
    };

    const priorityCounts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      URGENT: 0,
    };

    let totalEstimatedHours = 0;

    tasks.forEach((t) => {
      if (statusCounts[t.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[t.status as keyof typeof statusCounts]++;
      }
      if (priorityCounts[t.priority as keyof typeof priorityCounts] !== undefined) {
        priorityCounts[t.priority as keyof typeof priorityCounts]++;
      }
      totalEstimatedHours += t.estimatedHours || 0;
    });

    const totalTasks = tasks.length;
    const completedTasks = statusCounts.DONE;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const recentActivities = await prisma.activityLog.findMany({
      where: { projectId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatar: true, email: true } },
        task: { select: { id: true, taskKey: true, title: true } },
      },
    });

    return res.json({
      analytics: {
        totalTasks,
        completedTasks,
        completionRate,
        totalEstimatedHours,
        statusCounts,
        priorityCounts,
        membersCount: project._count.members,
        issuesCount: project._count.issues,
      },
      recentActivities,
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};
