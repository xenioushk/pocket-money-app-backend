import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/auth';
import validate from '../middleware/validate';

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('phone').optional().trim(),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// Routes
router.get('/me', protect, userController.getProfile);
router.put(
  '/me',
  protect,
  updateProfileValidation,
  validate,
  userController.updateProfile
);
router.patch(
  '/me/password',
  protect,
  changePasswordValidation,
  validate,
  userController.changePassword
);
router.delete('/me', protect, userController.deleteAccount);

export default router;
