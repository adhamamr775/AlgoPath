import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { AppError } from '../utils/AppError';

// 1. Define an explicit interface for your token payload (No more 'any')
export interface TokenPayload {
  user_id: number;   // <-- Change this from 'id' to 'user_id'
  system_role: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload; 
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // 2. Return immediately so we don't fall into the catch block
      return next(new AppError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as TokenPayload;
    
    req.user = decoded; 
    next();
  } catch (error) {
    // 3. This block now strictly catches actual JWT verification failures
    next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};
// backend/src/middleware/auth.ts (Addition)
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if the user's role is in the allowed list (e.g., ['Admin', 'Judge'])
    if (!req.user || !allowedRoles.includes(req.user.system_role)) {
      return next(new AppError('Forbidden: Insufficient system clearance', 403));
    }
    next();
  };
};