import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, data: any, message?: string) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, message: string, errors: any = null) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    details: errors,
  });
};
