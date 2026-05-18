import pool from '../../database/connection';
import { RowDataPacket } from 'mysql2';

export class TrackerService {
  async toggleCompletion(userId: number, problemId: number) {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM USER_COMPLETED WHERE user_id = ? AND problem_id = ?',
      [userId, problemId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM USER_COMPLETED WHERE user_id = ? AND problem_id = ?', [userId, problemId]);
      return { status: 'unchecked', problem_id: problemId };
    } else {
      await pool.query('INSERT INTO USER_COMPLETED (user_id, problem_id) VALUES (?, ?)', [userId, problemId]);
      return { status: 'checked', problem_id: problemId };
    }
  }

  async toggleVideoCompletion(userId: number, videoId: number) {
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM USER_COMPLETED_VIDEO WHERE user_id = ? AND video_id = ?',
      [userId, videoId]
    );

    if (existing.length > 0) {
      await pool.query('DELETE FROM USER_COMPLETED_VIDEO WHERE user_id = ? AND video_id = ?', [userId, videoId]);
      return { status: 'unchecked', video_id: videoId };
    } else {
      await pool.query('INSERT INTO USER_COMPLETED_VIDEO (user_id, video_id) VALUES (?, ?)', [userId, videoId]);
      return { status: 'checked', video_id: videoId };
    }
  }

  async getCompletionStats(userId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.name as topic, COUNT(uc.problem_id) as completed_count
       FROM USER_COMPLETED uc
       JOIN PROBLEM_TAG pt ON uc.problem_id = pt.problem_id
       JOIN TAGS t ON pt.tag_id = t.tag_id
       WHERE uc.user_id = ?
       GROUP BY t.tag_id, t.name`,
      [userId]
    );

    const [totalRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM USER_COMPLETED WHERE user_id = ?`,
      [userId]
    );

    return {
      total_completed: totalRows[0].total,
      topics: rows
    };
  }
}
