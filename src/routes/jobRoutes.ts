import express from 'express';
import { body, param, query } from 'express-validator';
import * as jobController from '../controllers/jobController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Valid category ID is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('duration').optional().trim(),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
];

const updateJobValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('category_id').optional().isInt({ min: 1 }),
  body('price').optional().isFloat({ min: 0 }),
  body('duration').optional().trim(),
  body('city').optional().trim().notEmpty(),
  body('date').optional().isISO8601(),
];

const updateStatusValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
  body('status')
    .isIn([
      'active',
      'inactive',
      'completed',
      'pending',
      'approved',
      'rejected',
    ])
    .withMessage('Valid status is required'),
];

const getAllJobsValidation = [
  query('category_id').optional().isInt({ min: 1 }),
  query('city').optional().trim(),
  query('status')
    .optional()
    .isIn([
      'active',
      'inactive',
      'completed',
      'pending',
      'approved',
      'rejected',
    ]),
  query('min_price').optional().isFloat({ min: 0 }),
  query('max_price').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

const jobIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
];

const userIdValidation = [
  param('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
];

// Routes
router.post(
  '/',
  protect,
  createJobValidation,
  validate,
  jobController.createJob
);
router.get('/', getAllJobsValidation, validate, jobController.getAllJobs);
router.get(
  '/user/:userId',
  userIdValidation,
  validate,
  jobController.getUserJobs
);
router.get('/:id', jobIdValidation, validate, jobController.getJobById);
router.put(
  '/:id',
  protect,
  updateJobValidation,
  validate,
  jobController.updateJob
);
router.delete(
  '/:id',
  protect,
  jobIdValidation,
  validate,
  jobController.deleteJob
);
router.patch(
  '/:id/status',
  protect,
  updateStatusValidation,
  validate,
  jobController.updateJobStatus
);

export default router;
