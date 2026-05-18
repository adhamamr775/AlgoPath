import pool from '../../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { AppError } from '../../utils/AppError';
import { hashPassword, comparePassword } from '../../utils/hash.utils';
import { signToken } from '../../utils/jwt.utils';

export class AuthService {
  async registerUser(username: string, email: string, password: string) {
    // 1. Check if user exists
    const [existing] = await pool.query<RowDataPacket[]>('SELECT user_id FROM USERS WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      throw new AppError('User with this email or username already exists', 409);
    }

    // 2. Hash Password
    const hashedFn = await hashPassword(password);

    // 3. Insert User (system_role defaults to 'Trainee' in DB)
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO USERS (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hashedFn]
    );

    const userId = result.insertId;
    const systemRole = 'Trainee';

    // 4. Generate JWT
    const token = signToken({ user_id: userId, system_role: systemRole });

    return {
      user: { user_id: userId, username, email, system_role: systemRole },
      token
    };
  }

  async loginUser(email: string, password: string) {
    // 1. Find user
    const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM USERS WHERE email = ?', [email]);
    if (users.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = users[0];

    // 2. Verify password
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate JWT
    const token = signToken({ user_id: user.user_id, system_role: user.system_role });

    return {
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        system_role: user.system_role
      },
      token
    };
  }
}
