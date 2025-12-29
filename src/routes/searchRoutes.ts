import express from 'express';
import { query } from 'express-validator';
import * as searchController from '../controllers/searchController';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const searchValidation = [
  query('q').trim().notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
];

// Routes
router.get('/', searchValidation, validate, searchController.searchJobs);

export default router;
