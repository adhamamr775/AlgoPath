import { Router } from 'express';
import { createLog, getStats } from './logs.controller';
import { requireAuth as authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createLogSchema } from './logs.schema';

const router = Router();

router.post('/', authenticate, validate(createLogSchema), createLog);
router.get('/stats/me', authenticate, getStats);

export default router;
