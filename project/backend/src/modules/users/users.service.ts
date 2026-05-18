import pool from '../../database/connection';
import { RowDataPacket } from 'mysql2';
import { AppError } from '../../utils/AppError';

export class UsersService {
  async getProfile(userId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT user_id, username, email, system_role, created_at
       FROM USERS 
       WHERE user_id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    return rows[0];
  }
}
