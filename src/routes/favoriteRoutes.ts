import express from 'express';
import { body, param } from 'express-validator';
import * as favoriteController from '../controllers/favoriteController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const addFavoriteValidation = [
  body('job_id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
];

const removeFavoriteValidation = [
  param('jobId').isInt({ min: 1 }).withMessage('Valid job ID is required'),
];

// Routes
router.post(
  '/',
  protect,
  addFavoriteValidation,
  validate,
  favoriteController.addFavorite
);
router.get('/', protect, favoriteController.getFavorites);
router.delete(
  '/:jobId',
  protect,
  removeFavoriteValidation,
  validate,
  favoriteController.removeFavorite
);

export default router;
