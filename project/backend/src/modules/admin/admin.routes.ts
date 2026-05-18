import { Router } from 'express';
import { 
  addResourceController, 
  addTopicController,
  getResourcesController,
  updateResourceController,
  deleteResourceController
} from './admin.controller';
import { requireAuth, requireRole } from '../../middleware/auth'; 

const router = Router();

const adminGuard = [requireAuth, requireRole(['Admin', 'Judge'])];

router.post('/add-resource', adminGuard, addResourceController);
router.post('/add-topic', adminGuard, addTopicController);
router.get('/resources', adminGuard, getResourcesController);

// CRITICAL: These two lines MUST have /:id at the end!
router.put('/resource/:id', adminGuard, updateResourceController);
router.delete('/resource/:id', adminGuard, deleteResourceController);

export default router;