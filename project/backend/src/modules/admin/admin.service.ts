import pool from '../../database/connection';

export class AdminService {
  
  // --- 1. CREATE: Add a new Video or Problem ---
  async addResource(resourceData: any) {
    const { title, url, difficulty, platform, type, tagId } = resourceData;

    // Insert the new resource into the PROBLEMS table
    const [result]: any = await pool.execute(`
      INSERT INTO PROBLEMS (title, problem_url, difficulty_rating, platform, resource_type)
      VALUES (?, ?, ?, ?, ?)
    `, [title, url, difficulty, platform, type]);

    const newProblemId = result.insertId;

    // Link the resource to a specific Topic/Tag in the PROBLEM_TAG table
    if (tagId) {
      await pool.execute(`
        INSERT INTO PROBLEM_TAG (problem_id, tag_id)
        VALUES (?, ?)
      `, [newProblemId, tagId]);
    }

    return { problem_id: newProblemId, title, type };
  }

  // --- 2. CREATE: Add a new Topic / Module ---
  // In backend/src/modules/admin/admin.service.ts
  async addTopic(name: string, category: string) {
    const [result]: any = await pool.execute(`
      INSERT INTO TAGS (name, category) VALUES (?, ?)
    `, [name, category]);
    
    return { tag_id: result.insertId, name, category };
  }

  // --- 3. READ: Get all resources for the Admin Table ---
  async getAllResources() {
    const [resources]: any = await pool.execute(`
      SELECT p.problem_id, p.title, p.problem_url, p.platform, p.resource_type, t.name as topic_name, pt.tag_id
      FROM PROBLEMS p
      LEFT JOIN PROBLEM_TAG pt ON p.problem_id = pt.problem_id
      LEFT JOIN TAGS t ON pt.tag_id = t.tag_id
      ORDER BY p.problem_id DESC
    `);
    return resources;
  }

  // --- 4. UPDATE: Edit an existing resource ---
  async updateResource(id: number, data: any) {
    const { title, url, platform, type, tagId } = data;
    
    await pool.execute(`
      UPDATE PROBLEMS 
      SET title = ?, problem_url = ?, platform = ?, resource_type = ? 
      WHERE problem_id = ?
    `, [title, url, platform, type, id]);

    if (tagId) {
      // First, check if a tag relationship already exists
      const [existingTag]: any = await pool.execute(
        'SELECT * FROM PROBLEM_TAG WHERE problem_id = ?', [id]
      );

      if (existingTag.length > 0) {
        // Update existing relationship
        await pool.execute(`
          UPDATE PROBLEM_TAG SET tag_id = ? WHERE problem_id = ?
        `, [tagId, id]);
      } else {
        // Insert new relationship if it didn't have one
        await pool.execute(`
          INSERT INTO PROBLEM_TAG (problem_id, tag_id) VALUES (?, ?)
        `, [id, tagId]);
      }
    }
    return { success: true };
  }

  // --- 5. DELETE: Remove a resource from the matrix ---
  async deleteResource(id: number) {
    // Delete the relationship first to avoid foreign key constraints
    await pool.execute('DELETE FROM PROBLEM_TAG WHERE problem_id = ?', [id]);
    
    // Delete from user tracking so we don't leave ghost stats in the database
    await pool.execute('DELETE FROM USER_COMPLETED WHERE problem_id = ?', [id]);
    
    // Finally, delete the actual resource
    await pool.execute('DELETE FROM PROBLEMS WHERE problem_id = ?', [id]);
    
    return { success: true };
  }
}