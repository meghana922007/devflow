import { Router } from 'express';
import { getProjects, getProjectById, createProject, addMember, deleteProject } from '../controllers/projectController';
import { getTasksByProject, createTask } from '../controllers/taskController';
import { getProjectAnalytics } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.delete('/:id', deleteProject);
router.post('/:id/members', addMember);

// Project Task sub-routes
router.get('/:projectId/tasks', getTasksByProject);
router.post('/:projectId/tasks', createTask);

// Project Analytics sub-route
router.get('/:projectId/analytics', getProjectAnalytics);

export default router;
