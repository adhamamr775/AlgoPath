import pool from '../../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class LogsService {
  async createLog(userId: number, problemId: number, status: string) {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO SUBMISSION_LOG (user_id, problem_id, status) VALUES (?, ?, ?)`,
      [userId, problemId, status]
    );
    return { submission_id: result.insertId, user_id: userId, problem_id: problemId, status };
  }

  async getStats(userId: number) {
    // AGGREGATION query mapping COUNT and GROUP BY across Logs, Problems & Tags
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT t.name as topic,
              COUNT(sl.submission_id) as total_submissions,
              SUM(CASE WHEN sl.status = 'AC' THEN 1 ELSE 0 END) as accepted_count,
              SUM(CASE WHEN sl.status != 'AC' THEN 1 ELSE 0 END) as failed_count
       FROM SUBMISSION_LOG sl
       JOIN PROBLEMS p ON sl.problem_id = p.problem_id
       JOIN PROBLEM_TAGS pt ON p.problem_id = pt.problem_id
       JOIN TAGS t ON pt.tag_id = t.tag_id
       WHERE sl.user_id = ?
       GROUP BY t.tag_id, t.name`,
      [userId]
    );

    return rows;
  }
}
