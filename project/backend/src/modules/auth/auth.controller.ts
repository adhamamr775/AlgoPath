import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response.utils';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const data = await authService.registerUser(username, email, password);
    sendSuccess(res, 201, data, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await authService.loginUser(email, password);
    sendSuccess(res, 200, data, 'Login successful');
  } catch (error) {
    next(error);
  }
};
