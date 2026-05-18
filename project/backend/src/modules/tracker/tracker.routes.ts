import { Router } from 'express';
import { toggleProblem,  getStats } from './tracker.controller';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { toggleProblemSchema, toggleVideoSchema } from './tracker.schema';

const router = Router();


router.post('/toggle-problem', requireAuth, toggleProblem);
router.get('/stats', requireAuth, getStats);

export default router;
