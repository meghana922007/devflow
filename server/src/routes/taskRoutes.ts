import { Router } from 'express';
import { updateTask, moveTaskStatus, deleteTask } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.put('/:id', updateTask);
router.patch('/:id/move', moveTaskStatus);
router.delete('/:id', deleteTask);

export default router;
