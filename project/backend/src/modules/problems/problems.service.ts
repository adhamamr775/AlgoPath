import pool from '../../database/connection';
import { RowDataPacket } from 'mysql2';

export class ProblemsService {
  async getProblems(filters: { difficulty?: string; platform?: string; topic?: string }, userId?: number) {
    let query = `
      SELECT p.problem_id, p.title, p.problem_url, p.difficulty_rating, p.platform,
             GROUP_CONCAT(t.name) as tags,
             IF(uc.problem_id IS NOT NULL, true, false) as is_completed
      FROM PROBLEMS p
      LEFT JOIN PROBLEM_TAG pt ON p.problem_id = pt.problem_id
      LEFT JOIN TAGS t ON pt.tag_id = t.tag_id
      LEFT JOIN USER_COMPLETED uc ON p.problem_id = uc.problem_id AND uc.user_id = ?
      WHERE 1=1
    `;
    const params: any[] = [userId || 0];

    if (filters.difficulty) {
      query += ` AND p.difficulty_rating = ?`;
      params.push(parseInt(filters.difficulty, 10));
    }

    if (filters.platform) {
      query += ` AND p.platform = ?`;
      params.push(filters.platform);
    }

    if (filters.topic) {
      query += ` AND p.problem_id IN (
        SELECT pt2.problem_id 
        FROM PROBLEM_TAG pt2 
        JOIN TAGS t2 ON pt2.tag_id = t2.tag_id 
        WHERE t2.name = ?
      )`;
      params.push(filters.topic);
    }

    query += ` GROUP BY p.problem_id ORDER BY p.difficulty_rating ASC, p.problem_id ASC`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    // Format the boolean output from mysql IF()
    return rows.map(r => ({
      ...r,
      is_completed: r.is_completed === 1
    }));
  }
}
