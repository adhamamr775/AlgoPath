import { Router } from 'express';
import { getProblems } from './problems.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { getProblemsSchema } from './problems.schema';
import { verifyToken } from '../../utils/jwt.utils';

const router = Router();

// Custom soft-auth middleware to extract user if logged in, but not block if not
const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.split(' ')[1]);
    } catch (e) {}
  }
  next();
};

router.get('/', optionalAuth, validate(getProblemsSchema), getProblems);

export default router;
