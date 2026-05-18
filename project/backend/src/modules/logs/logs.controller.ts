import { Request, Response, NextFunction } from 'express';
import { LogsService } from './logs.service';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../utils/AppError';

const logsService = new LogsService();

export const createLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    if (!userId) throw new AppError('Unauthorized', 401);
    
    const { problem_id, status } = req.body;
    const log = await logsService.createLog(userId, problem_id, status);
    sendSuccess(res, 201, log);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.user_id;
    if (!userId) throw new AppError('Unauthorized', 401);

    const stats = await logsService.getStats(userId);
    sendSuccess(res, 200, stats);
  } catch (error) {
    next(error);
  }
};
