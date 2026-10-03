import { Router } from 'express';
import { getAllUsers } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);
router.get('/', getAllUsers);

export default router;
