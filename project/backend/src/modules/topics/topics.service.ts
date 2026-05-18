import pool from '../../database/connection'; 

export class TopicsService {
  /**
   * Fetches unified resources for a specific topic (e.g., 'binary-search')
   */
  async getTopicData(topicName: string, userId: number | null) {
  // 1. We transform 'node-js-mastery' -> 'node%js%mastery'
  // Using % (wildcard) allows us to match 'Node.js Mastery' even with the dot!
  const searchPattern = topicName.replace(/-/g, '%');

  const [resources]: any = await pool.execute(`
    SELECT 
      p.problem_id,
      p.title,
      p.problem_url,
      p.difficulty_rating,
      p.platform,
      p.resource_type,
      IF(uc.user_id IS NOT NULL, TRUE, FALSE) as is_completed
    FROM PROBLEMS p
    JOIN PROBLEM_TAG pt ON p.problem_id = pt.problem_id
    JOIN TAGS t ON pt.tag_id = t.tag_id
    LEFT JOIN USER_COMPLETED uc ON p.problem_id = uc.problem_id AND uc.user_id = ?
    -- FIX: Using LIKE with wildcards to ignore dots/special chars
    WHERE t.name LIKE ? 
  `, [userId, `%${searchPattern}%`]);

  // 2. Return the split data
  return {
    videos: resources.filter((r: any) => r.resource_type === 'learning'),
    problems: resources.filter((r: any) => r.resource_type === 'practice')
  };
}
  /**
   * Compiles total stats for the Topics Directory or Dashboard
   */
  async getTopicStats(userId: number) {
    const [topics]: any = await pool.execute(`
      SELECT 
        t.name AS topic,
        -- Total number of coding problems available for this tag
        (SELECT COUNT(*) FROM PROBLEM_TAG pt2 
         JOIN PROBLEMS p2 ON pt2.problem_id = p2.problem_id 
         WHERE pt2.tag_id = t.tag_id AND p2.resource_type = 'practice') AS total_problems,
        -- Total number of coding problems THIS user has finished
        COUNT(DISTINCT CASE WHEN p.resource_type = 'practice' THEN uc.problem_id END) AS completed_count
      FROM TAGS t
      LEFT JOIN PROBLEM_TAG pt ON t.tag_id = pt.tag_id
      LEFT JOIN PROBLEMS p ON pt.problem_id = p.problem_id
      LEFT JOIN USER_COMPLETED uc ON p.problem_id = uc.problem_id AND uc.user_id = ?
      WHERE t.category = 'algorithm'
      GROUP BY t.tag_id, t.name
      ORDER BY t.name ASC
    `, [userId]);

    return topics;
  }
}