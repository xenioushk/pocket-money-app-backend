import { Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../types';

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search for jobs
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Search query is required
 */
export const searchJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    const searchQuery = `%${q.toLowerCase()}%`;

    // Count total results
    const countResult = await query(
      `SELECT COUNT(*) FROM jobs j
       JOIN categories c ON j.category_id = c.id
       WHERE LOWER(j.title) LIKE $1
          OR LOWER(j.description) LIKE $1
          OR LOWER(j.city) LIKE $1
          OR LOWER(c.name) LIKE $1`,
      [searchQuery]
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const offset = (Number(page) - 1) * Number(limit);
    const result = await query(
      `SELECT j.*, u.first_name, u.last_name, c.name as category_name
       FROM jobs j
       JOIN users u ON j.user_id = u.id
       JOIN categories c ON j.category_id = c.id
       WHERE LOWER(j.title) LIKE $1
          OR LOWER(j.description) LIKE $1
          OR LOWER(j.city) LIKE $1
          OR LOWER(c.name) LIKE $1
       ORDER BY j.created_at DESC
       LIMIT $2 OFFSET $3`,
      [searchQuery, limit, offset]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
