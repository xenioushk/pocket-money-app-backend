import express from 'express';
import authRoutes from './authRoutes';
import jobRoutes from './jobRoutes';
import categoryRoutes from './categoryRoutes';
import userRoutes from './userRoutes';
import favoriteRoutes from './favoriteRoutes';
import searchRoutes from './searchRoutes';
import imageRoutes from './imageRoutes';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication endpoints
 *   - name: Jobs
 *     description: Job management endpoints
 *   - name: Categories
 *     description: Category management endpoints
 *   - name: Favorites
 *     description: User favorites endpoints
 *   - name: Search
 *     description: Search endpoints
 *   - name: Users
 *     description: User profile endpoints
 *   - name: Images
 *     description: Image upload and management endpoints
 */

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/categories', categoryRoutes);
router.use('/users', userRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/search', searchRoutes);
router.use('/jobs', imageRoutes); // Image routes are mounted under /jobs/:id/images

export default router;
