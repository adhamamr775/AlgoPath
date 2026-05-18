import { Router } from 'express';
import { getTopic } from './topics.controller';
import { requireAuth, requireRole } from '../../middleware/auth'; // <-- CHANGED TO MATCH YOUR MIDDLEWARE
import { addResourceController } from '../admin/admin.controller'; // <-- ADDED THIS IMPORT
const router = Router();

// Route to fetch a specific topic's resources, protected by your JWT middleware
router.get('/:topicName', requireAuth, getTopic); // <-- CHANGED HERE TOO
// Example inside topics.routes.ts
router.post('/add-resource', requireAuth, requireRole(['Admin', 'Judge']), addResourceController);
export default router;