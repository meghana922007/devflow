import { Response } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, role: true },
            },
          },
        },
        _count: {
          select: { tasks: true, issues: true, members: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ projects });
  } catch (error: any) {
    console.error('getProjects error:', error);
    return res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

export const getProjectById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, role: true, githubUsername: true },
            },
          },
        },
        _count: {
          select: { tasks: true, issues: true },
        },
      },
    });

    if (!project) return res.status(404).json({ message: 'Project not found' });

    return res.json({ project });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch project details', error: error.message });
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, key, description, category, color } = req.body;

    if (!name || !key) {
      return res.status(400).json({ message: 'Project Name and Key (e.g., DF) are required.' });
    }

    const cleanKey = key.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    const existingProject = await prisma.project.findUnique({ where: { key: cleanKey } });
    if (existingProject) {
      return res.status(400).json({ message: `Project key '${cleanKey}' is already in use. Please use a unique key.` });
    }

    const project = await prisma.project.create({
      data: {
        name,
        key: cleanKey,
        description,
        category: category || 'WEB',
        color: color || '#6366f1',
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
      },
    });

    // Record Activity Log
    await prisma.activityLog.create({
      data: {
        projectId: project.id,
        userId,
        action: 'PROJECT_CREATED',
        details: `Project "${name}" (${cleanKey}) was created by user.`,
      },
    });

    return res.status(201).json({ project });
  } catch (error: any) {
    console.error('createProject error:', error);
    return res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

export const addMember = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { userEmail, role } = req.body;

    if (!userEmail) return res.status(400).json({ message: 'User email is required' });

    const userToAdd = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!userToAdd) return res.status(404).json({ message: 'No registered user found with this email' });

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: userToAdd.id,
        },
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: role || 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true, role: true } },
      },
    });

    if (req.user?.userId) {
      await prisma.activityLog.create({
        data: {
          projectId,
          userId: req.user.userId,
          action: 'MEMBER_ADDED',
          details: `Added ${userToAdd.name} to project as ${role || 'MEMBER'}.`,
        },
      });
    }

    return res.status(201).json({ member });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to add project member', error: error.message });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only the project owner can delete this project' });
    }

    await prisma.project.delete({ where: { id } });
    return res.json({ message: 'Project deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
};
