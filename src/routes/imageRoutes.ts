import express from 'express';
import { param } from 'express-validator';
import * as imageController from '../controllers/imageController';
import { protect } from '../middleware/auth';
import upload from '../middleware/upload';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const jobIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
];

const imageIdValidation = [
  param('id').isInt({ min: 1 }).withMessage('Valid job ID is required'),
  param('imageId').isInt({ min: 1 }).withMessage('Valid image ID is required'),
];

// Routes
router.post(
  '/:id/images',
  protect,
  jobIdValidation,
  validate,
  upload.array('images', 5),
  imageController.uploadImages
);
router.get(
  '/:id/images',
  jobIdValidation,
  validate,
  imageController.getJobImages
);
router.delete(
  '/:id/images/:imageId',
  protect,
  imageIdValidation,
  validate,
  imageController.deleteImage
);
router.patch(
  '/:id/images/:imageId/primary',
  protect,
  imageIdValidation,
  validate,
  imageController.setPrimaryImage
);

export default router;
