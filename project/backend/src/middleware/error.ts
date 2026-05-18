import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response.utils';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message);
  }

  // Handle expected raw database errors gracefully without leaking
  if (err.code && err.code.startsWith('ER_')) {
    if (err.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'Duplicate entry found.');
    }
    return sendError(res, 500, 'Database error occurred.');
  }

  // Default fallback
  sendError(res, 500, 'Internal server error');
};
