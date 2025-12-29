import { Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a job to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *             properties:
 *               job_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Job added to favorites
 *       400:
 *         description: Job already in favorites
 *       401:
 *         description: Unauthorized
 */
export const addFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { job_id } = req.body;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    // Check if job exists
    const jobExists = await query('SELECT id FROM jobs WHERE id = $1', [
      job_id,
    ]);
    if (jobExists.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    // Check if already favorited
    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = $1 AND job_id = $2',
      [userId, job_id]
    );

    if (existing.rows.length > 0) {
      return next(new AppError('Job already in favorites', 400));
    }

    const result = await query(
      'INSERT INTO favorites (user_id, job_id) VALUES ($1, $2) RETURNING *',
      [userId, job_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all user favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite jobs
 *       401:
 *         description: Unauthorized
 */
export const getFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await query(
      `SELECT f.id as favorite_id, f.created_at as favorited_at, j.*, 
              u.first_name, u.last_name, c.name as category_name
       FROM favorites f
       JOIN jobs j ON f.job_id = j.id
       JOIN users u ON j.user_id = u.id
       JOIN categories c ON j.category_id = c.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/favorites/{jobId}:
 *   delete:
 *     summary: Remove a job from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID to remove from favorites
 *     responses:
 *       200:
 *         description: Job removed from favorites
 *       404:
 *         description: Favorite not found
 *       401:
 *         description: Unauthorized
 */
export const removeFavorite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    const result = await query(
      'DELETE FROM favorites WHERE user_id = $1 AND job_id = $2 RETURNING *',
      [userId, jobId]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Favorite not found', 404));
    }

    res.json({
      success: true,
      message: 'Job removed from favorites',
    });
  } catch (error) {
    next(error);
  }
};
