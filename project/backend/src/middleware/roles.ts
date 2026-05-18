import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.system_role) {
        throw new AppError('Unauthorized: Roles not found', 403);
      }

      if (!allowedRoles.includes(req.user.system_role)) {
        throw new AppError('Forbidden: Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
