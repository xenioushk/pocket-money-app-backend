import { Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { query } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

/**
 * @swagger
 * /api/jobs/{id}/images:
 *   post:
 *     summary: Upload images for a job
 *     tags: [Images]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Images uploaded successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Job not found
 */
export const uploadImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(new AppError('No images uploaded', 400));
    }

    // Check if job exists and belongs to user
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    if (jobCheck.rows[0].user_id !== userId) {
      return next(
        new AppError('Not authorized to upload images for this job', 403)
      );
    }

    // Check if job already has images
    const existingImages = await query(
      'SELECT COUNT(*) FROM images WHERE job_id = $1',
      [id]
    );
    const hasImages = parseInt(existingImages.rows[0].count) > 0;

    // Insert images
    const imagePromises = files.map((file: any, index) => {
      const imageUrl = file.path; // Cloudinary returns full URL in file.path
      const isPrimary = !hasImages && index === 0; // First image is primary if no existing images

      return query(
        'INSERT INTO images (job_id, image_url, is_primary) VALUES ($1, $2, $3) RETURNING *',
        [id, imageUrl, isPrimary]
      );
    });

    const results = await Promise.all(imagePromises);
    const images = results.map((r) => r.rows[0]);

    res.status(201).json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/{id}/images:
 *   get:
 *     summary: Get all images for a job
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *     responses:
 *       200:
 *         description: List of job images
 */
export const getJobImages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM images WHERE job_id = $1 ORDER BY is_primary DESC, created_at ASC',
      [id]
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
 * /api/jobs/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Image not found
 */
export const deleteImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, imageId } = req.params;
    const userId = req.user?.id;

    // Check if job belongs to user
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    if (jobCheck.rows[0].user_id !== userId) {
      return next(
        new AppError('Not authorized to delete images for this job', 403)
      );
    }

    // Get image details
    const imageResult = await query(
      'SELECT * FROM images WHERE id = $1 AND job_id = $2',
      [imageId, id]
    );

    if (imageResult.rows.length === 0) {
      return next(new AppError('Image not found', 404));
    }

    const image = imageResult.rows[0];

    // Delete from database
    await query('DELETE FROM images WHERE id = $1', [imageId]);

    // Delete from Cloudinary
    try {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}.{format}
      const urlParts = image.image_url.split('/');
      const fileWithExt = urlParts[urlParts.length - 1];
      const publicId = `pocket-money-jobs/${fileWithExt.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.error('Error deleting file from Cloudinary:', err);
      // Continue even if Cloudinary deletion fails
    }

    // If deleted image was primary, set another image as primary
    if (image.is_primary) {
      const otherImages = await query(
        'SELECT id FROM images WHERE job_id = $1 LIMIT 1',
        [id]
      );

      if (otherImages.rows.length > 0) {
        await query('UPDATE images SET is_primary = true WHERE id = $1', [
          otherImages.rows[0].id,
        ]);
      }
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/jobs/{id}/images/{imageId}/primary:
 *   patch:
 *     summary: Set an image as primary
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Job ID
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Image ID
 *     responses:
 *       200:
 *         description: Primary image updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Image not found
 */
export const setPrimaryImage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, imageId } = req.params;
    const userId = req.user?.id;

    // Check if job belongs to user
    const jobCheck = await query('SELECT user_id FROM jobs WHERE id = $1', [
      id,
    ]);

    if (jobCheck.rows.length === 0) {
      return next(new AppError('Job not found', 404));
    }

    if (jobCheck.rows[0].user_id !== userId) {
      return next(
        new AppError('Not authorized to modify images for this job', 403)
      );
    }

    // Verify image exists
    const imageCheck = await query(
      'SELECT id FROM images WHERE id = $1 AND job_id = $2',
      [imageId, id]
    );

    if (imageCheck.rows.length === 0) {
      return next(new AppError('Image not found', 404));
    }

    // Reset all images for this job
    await query('UPDATE images SET is_primary = false WHERE job_id = $1', [id]);

    // Set new primary image
    const result = await query(
      'UPDATE images SET is_primary = true WHERE id = $1 RETURNING *',
      [imageId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
