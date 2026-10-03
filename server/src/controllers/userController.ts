import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        bio: true,
        githubUsername: true,
      },
      orderBy: { name: 'asc' },
    });

    return res.json({ users });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};
