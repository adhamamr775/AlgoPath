import { Request, Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { sendSuccess } from '../../utils/response.utils';
import { AppError } from '../../utils/AppError'; // Make sure to import your AppError!

const usersService = new UsersService();

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.user_id;

    // GUARD CLAUSE: If userId is missing, stop here. 
    // This perfectly satisfies TypeScript because past this block, userId can ONLY be a number.
    if (!userId) {
      return next(new AppError('Operator ID missing from authorized request', 400));
    }

    // Now TypeScript knows userId is strictly a 'number'
    const profile = await usersService.getProfile(userId); 
    
    sendSuccess(res, 200, profile);
  } catch (error) {
    next(error);
  }
};