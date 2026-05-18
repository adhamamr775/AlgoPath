import { Request, Response, NextFunction } from 'express';
import { ProblemsService } from './problems.service';
import { sendSuccess } from '../../utils/response.utils';

const problemsService = new ProblemsService();

export const getProblems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      difficulty: req.query.difficulty as string,
      platform: req.query.platform as string,
      topic: req.query.topic as string
    };
    
    // Extract userId safely if provided
    const userId = req.user ? req.user.user_id : undefined;

    const problems = await problemsService.getProblems(filters, userId);
    sendSuccess(res, 200, problems);
  } catch (error) {
    next(error);
  }
};
