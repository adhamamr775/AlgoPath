import { Router } from 'express';
import { getAllTagsController } from './tags.controller';

const router = Router();

// We don't need authentication here because trainees need to see the topics too!
router.get('/', getAllTagsController);

export default router;