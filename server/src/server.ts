import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import { initSocket } from './socket/socketHandler';
import { seedDatabase } from './utils/seed';
import prisma from './config/db';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// Initialize Socket.IO
initSocket(server);

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DevFlow API',
    timestamp: new Date().toISOString(),
  });
});

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  console.log(`\n==================================================`);
  console.log(`🚀 DevFlow Backend Server running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`==================================================\n`);

  // Auto-seed database if empty
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('📦 Database is empty. Running initial seed...');
      await seedDatabase();
    }
  } catch (err) {
    console.error('Error checking DB count for seed:', err);
  }
});
