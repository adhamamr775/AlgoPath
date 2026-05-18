import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'algopath_super_secret_key_change_me';
const JWT_EXPIRES_IN = '7d'; // Use strict string instead of process.env to avoid TS errors on SignOptions

export const signToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
