import express from 'express';
import { body, param } from 'express-validator';
import * as categoryController from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const createCategoryValidation = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('slug')
    .trim()
    .notEmpty()
    .withMessage('Category slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Slug must be lowercase with hyphens only'),
  body('description').optional().trim(),
];

const updateCategoryValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('name').optional().trim().notEmpty(),
  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('description').optional().trim(),
];

const categoryIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid category ID is required'),
];

const categorySlugValidation = [
  param('slug').trim().notEmpty().withMessage('Category slug is required'),
];

// Routes
router.get('/', categoryController.getAllCategories);
router.get(
  '/:slug',
  categorySlugValidation,
  validate,
  categoryController.getCategoryBySlug
);
router.post(
  '/',
  protect,
  authorize('admin'),
  createCategoryValidation,
  validate,
  categoryController.createCategory
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateCategoryValidation,
  validate,
  categoryController.updateCategory
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  categoryIdValidation,
  validate,
  categoryController.deleteCategory
);

export default router;
