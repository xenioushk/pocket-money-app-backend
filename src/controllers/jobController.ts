import { Response, NextFunction } from 'express';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category_id
 *               - price
 *               - city
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               city:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
export const createJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, category_id, price, duration, city, date } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new AppError('User not authenticated', 401));
    }

    const result = await query(
      `INSERT INTO jobs (user_id, title, description, category_id, price, duration, city, date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING id, user_id, title, description, category_id, price, duration, city, date, status, created_at, updated_at`,
      [userId, title, description, category_id, price, duration, city, date]
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
 * /api/jobs:
 *   get:
 *     summary: Get all jobs with optional filters
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, completed, pending, approved, rejected]
 *         description: Filter by status
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price
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
 *         description: List of jobs
 */
export const getAllJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category_id,
      city,
      status,
      min_price,
      max_price,
      page = 1,
      limit = 20,
    } = req.query;

    let queryText = `
      SELECT j.*, u.first_name, u.last_name, u.email, c.name as category_name
      FROM jobs j
      JOIN users u ON j.user_id = u.id
      JOIN categories c ON j.category_id = c.id
      WHERE 1=1
    `;
    const queryParams: any[] = [];
    let paramCount = 0;

    if (category_id) {
      paramCount++;
      queryText += ` AND j.category_id = $${paramCount}`;
      queryParams.push(category_id);
    }

    if (city) {
      paramCount++;
      queryText += ` AND LOWER(j.city) = LOWER($${paramCount})`;
      queryParams.push(city);
    }

    if (status) {
      paramCount++;
      queryText += ` AND j.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (min_price) {
      paramCount++;
      queryText += ` AND j.price >= $${paramCount}`;
      queryParams.push(min_price);
    }

    if (max_price) {
      paramCount++;
      queryText += ` AND j.price <= $${paramCount}`;
      queryParams.push(max_price);
    }

    // Count total
    const countResult = await query(
      queryText.replace(
        'SELECT j.*, u.first_name, u.last_name, u.email, c.name as category_name',
        'SELECT COUNT(*)'
      ),
      queryParams
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    paramCount++;
    queryText += ` ORDER BY j.created_at DESC LIMIT $${paramCount}`;
    queryParams.push(limit);
    paramCount++;
    queryText += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await query(queryText, queryParams);

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

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get a single job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
export const getJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT j.*, u.first_name, u.last_name, u.email, u.phone, c.name as category_name,
        (SELECT json_agg(json_build_object('id', i.id, 'image_url', i.image_url, 'is_primary', i.is_primary))
         FROM images i WHERE i.job_id = j.id) as images
       FROM jobs j
       JOIN users u ON j.user_id = u.id
       JOIN categories c ON j.category_id = c.id
       WHERE j.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration:
 *                 type: string
 *               city:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       403:
 *         description: Not authorized to update this job
 *       404:
 *         description: Job not found
 */
export const updateJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, category_id, price, duration, city, date } =
      req.body;

    // Check if job exists and belongs to user
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    if (jobCheck.rows[0].user_id !== userId) {
      return next(new AppError('Not authorized to update this job', 403));
    }

    const result = await query(
      `UPDATE jobs
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           price = COALESCE($4, price),
           duration = COALESCE($5, duration),
           city = COALESCE($6, city),
           date = COALESCE($7, date),
           updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [title, description, category_id, price, duration, city, date, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       403:
 *         description: Not authorized to delete this job
 *       404:
 *         description: Job not found
 */
export const deleteJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if job exists and belongs to user
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    if (jobCheck.rows[0].user_id !== userId) {
      return next(new AppError('Not authorized to delete this job', 403));
    }

    await query('DELETE FROM jobs WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, completed, pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Job not found
 */
export const updateJobStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    // Check if job exists
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    // Only job owner or admin can update status
    if (jobCheck.rows[0].user_id !== userId && userRole !== 'admin') {
      return next(
        new AppError('Not authorized to update this job status', 403)
      );
    }

    const result = await query(
      'UPDATE jobs SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/user/{userId}:
 *   get:
 *     summary: Get all jobs by a specific user
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's jobs
 */
export const getUserJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const result = await query(
      `SELECT j.*, c.name as category_name
       FROM jobs j
       JOIN categories c ON j.category_id = c.id
       WHERE j.user_id = $1
       ORDER BY j.created_at DESC`,
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
