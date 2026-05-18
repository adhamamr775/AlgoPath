import { Request, Response, NextFunction } from 'express';
import { TrackerService } from './tracker.service';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../utils/AppError';

const trackerService = new TrackerService();

export const toggleProblem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id;
    
    // GUARD CLAUSE: Satisfies TypeScript strictness
    if (!userId) {
      return next(new AppError('Operator ID missing from authorized request', 400));
    }

    // Accept camelCase (problemId) from our updated frontend or snake_case (problem_id)
    const problemId = req.body.problemId || req.body.problem_id;
    
    if (!problemId) {
      return next(new AppError('Resource ID is required to execute toggle', 400));
    }
    
    // This single service method now handles BOTH practice problems and learning videos
    const result = await trackerService.toggleCompletion(userId, problemId);
    
    sendSuccess(res, 200, result, 'Resource status toggled successfully');
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id;
    
    // GUARD CLAUSE: Satisfies TypeScript strictness
    if (!userId) {
      return next(new AppError('Operator ID missing from authorized request', 400));
    }

    const stats = await trackerService.getCompletionStats(userId);
    sendSuccess(res, 200, stats);
  } catch (error) {
    next(error);
  }
};