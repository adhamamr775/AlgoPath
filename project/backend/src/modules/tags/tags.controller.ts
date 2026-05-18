import { Request, Response, NextFunction } from 'express';
import pool from '../../database/connection';
import { sendSuccess } from '../../utils/response.utils';

export const getAllTagsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, userId } = req.query;

    let query = `
      SELECT 
        t.tag_id, 
        t.name, 
        t.category,
        (
          SELECT COUNT(*) 
          FROM PROBLEM_TAG pt 
          JOIN PROBLEMS p ON pt.problem_id = p.problem_id 
          WHERE pt.tag_id = t.tag_id AND p.resource_type = 'practice'
        ) AS total_problems,
        (
          SELECT COUNT(*) 
          FROM USER_COMPLETED uc 
          JOIN PROBLEM_TAG pt2 ON uc.problem_id = pt2.problem_id 
          WHERE pt2.tag_id = t.tag_id AND uc.user_id = ?
        ) AS completed_count
      FROM TAGS t
    `;

    // Strict safety check: If it's undefined, null, or NaN, default to 0
    let uid = 0;
    if (userId && userId !== 'undefined' && userId !== 'null') {
      const parsed = parseInt(userId as string);
      if (!isNaN(parsed)) {
        uid = parsed;
      }
    }
    
    const params: any[] = [uid];

    if (category) {
      query += ' WHERE t.category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY t.name ASC';

    const [tags]: any = await pool.execute(query, params);
    sendSuccess(res, 200, tags, 'Tags retrieved successfully');
  } catch (error) {
    next(error);
  }
};