import bcrypt from 'bcryptjs';
import prisma from '../config/db';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data safely
    await prisma.activityLog.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Demo Users
    const alex = await prisma.user.create({
      data: {
        name: 'Alex Rivers',
        email: 'alex@devflow.io',
        password: hashedPassword,
        role: 'ADMIN',
        bio: 'Lead Engineering Architect & DevFlow maintainer.',
        githubUsername: 'arivers-dev',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
      },
    });

    const meghana = await prisma.user.create({
      data: {
        name: 'Meghana Dev',
        email: 'meghana@devflow.io',
        password: hashedPassword,
        role: 'LEAD',
        bio: 'Full-stack lead developer working on unified workflow tools.',
        githubUsername: 'meghana-dev',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Meghana',
      },
    });

    const sarah = await prisma.user.create({
      data: {
        name: 'Sarah Chen',
        email: 'sarah@devflow.io',
        password: hashedPassword,
        role: 'DEVELOPER',
        bio: 'Backend Specialist & Database Performance enthusiast.',
        githubUsername: 'sarah-chen',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah',
      },
    });

    const marcus = await prisma.user.create({
      data: {
        name: 'Marcus Vance',
        email: 'marcus@devflow.io',
        password: hashedPassword,
        role: 'DEVELOPER',
        bio: 'Frontend UI/UX perfectionist & React enthusiast.',
        githubUsername: 'marcus-vance',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
      },
    });

    console.log('✅ Created 4 Demo Users');

    // Create Main Project
    const project1 = await prisma.project.create({
      data: {
        name: 'DevFlow Workspace Platform',
        key: 'DF',
        description: 'Unified developer collaboration platform connecting Kanban tasks, GitHub, CI/CD, and AI.',
        category: 'WEB',
        color: '#6366f1',
        ownerId: alex.id,
        members: {
          create: [
            { userId: alex.id, role: 'OWNER' },
            { userId: meghana.id, role: 'MAINTAINER' },
            { userId: sarah.id, role: 'MEMBER' },
            { userId: marcus.id, role: 'MEMBER' },
          ],
        },
      },
    });

    const project2 = await prisma.project.create({
      data: {
        name: 'GitHub Integration & Webhook Engine',
        key: 'GHE',
        description: 'High-throughput Webhook receiver for GitHub commits, PRs, and Actions CI/CD pipeline events.',
        category: 'BACKEND',
        color: '#10b981',
        ownerId: meghana.id,
        members: {
          create: [
            { userId: meghana.id, role: 'OWNER' },
            { userId: alex.id, role: 'MAINTAINER' },
            { userId: sarah.id, role: 'MEMBER' },
          ],
        },
      },
    });

    console.log('✅ Created 2 Demo Projects');

    // Create Tasks for Project 1
    const tasksData = [
      {
        taskKey: 'DF-1',
        title: 'Setup JWT Authentication & User Session Management',
        description: 'Implement JWT token generation, password hashing with bcryptjs, and auth headers middleware.',
        status: 'DONE',
        priority: 'HIGH',
        tags: JSON.stringify(['auth', 'security', 'backend']),
        gitBranch: 'feature/jwt-auth',
        estimatedHours: 6,
        creatorId: alex.id,
        assigneeId: sarah.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-2',
        title: 'Design & Build Responsive Kanban Board UI',
        description: 'Interactive 4-column Kanban board with real-time status transitions, filters, and glassmorphic cards.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        tags: JSON.stringify(['frontend', 'react', 'kanban']),
        gitBranch: 'feature/kanban-ui',
        estimatedHours: 8,
        creatorId: alex.id,
        assigneeId: marcus.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-3',
        title: 'Implement Real-Time Socket.IO Task Sync',
        description: 'Broadcast task movement and creation live to all connected team members on the project dashboard.',
        status: 'IN_REVIEW',
        priority: 'URGENT',
        tags: JSON.stringify(['websockets', 'realtime', 'socket.io']),
        gitBranch: 'feature/socket-sync',
        estimatedHours: 5,
        creatorId: meghana.id,
        assigneeId: meghana.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-4',
        title: 'Configure Prisma Schema & SQLite/Postgres DB',
        description: 'Define relational models for Users, Projects, Tasks, Issues, and ActivityLogs with foreign key constraints.',
        status: 'DONE',
        priority: 'MEDIUM',
        tags: JSON.stringify(['database', 'prisma', 'sqlite']),
        gitBranch: 'main',
        estimatedHours: 4,
        creatorId: sarah.id,
        assigneeId: sarah.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-5',
        title: 'Add AI Pull Request Summary & Error Explainer Endpoint',
        description: 'Connect LLM service to analyze git diffs and CI/CD build error logs directly inside DevFlow.',
        status: 'TO_DO',
        priority: 'URGENT',
        tags: JSON.stringify(['ai', 'llm', 'github']),
        gitBranch: 'feature/ai-assistant',
        estimatedHours: 12,
        creatorId: alex.id,
        assigneeId: alex.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-6',
        title: 'Integrate GitHub Actions CI/CD Build Status Listener',
        description: 'Listen to workflow_run webhooks and show build status pass/fail badges on Kanban tasks.',
        status: 'TO_DO',
        priority: 'MEDIUM',
        tags: JSON.stringify(['cicd', 'github-actions', 'devops']),
        gitBranch: 'feature/cicd-listener',
        estimatedHours: 6,
        creatorId: meghana.id,
        assigneeId: meghana.id,
        projectId: project1.id,
      },
      {
        taskKey: 'DF-7',
        title: 'User Profile & Team Member Management Modal',
        description: 'Allow adding project members by email and managing roles (Owner, Maintainer, Member).',
        status: 'IN_PROGRESS',
        priority: 'LOW',
        tags: JSON.stringify(['ui', 'team']),
        gitBranch: 'feature/team-modal',
        estimatedHours: 3,
        creatorId: marcus.id,
        assigneeId: marcus.id,
        projectId: project1.id,
      },
    ];

    for (const task of tasksData) {
      await prisma.task.create({ data: task });
    }

    console.log(`✅ Seeded ${tasksData.length} Kanban Tasks`);

    // Create Initial Activity Logs
    await prisma.activityLog.createMany({
      data: [
        {
          projectId: project1.id,
          userId: alex.id,
          action: 'PROJECT_CREATED',
          details: 'DevFlow Workspace Platform initialized.',
        },
        {
          projectId: project1.id,
          userId: sarah.id,
          action: 'TASK_MOVED',
          details: 'Moved DF-1 (JWT Auth) to DONE.',
        },
        {
          projectId: project1.id,
          userId: marcus.id,
          action: 'TASK_MOVED',
          details: 'Moved DF-2 (Kanban Board UI) to IN_PROGRESS.',
        },
        {
          projectId: project1.id,
          userId: meghana.id,
          action: 'TASK_MOVED',
          details: 'Moved DF-3 (Socket.IO Sync) to IN_REVIEW.',
        },
      ],
    });

    console.log('🚀 Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Execute if run directly
if (require.main === module) {
  seedDatabase();
}
