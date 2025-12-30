import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { AppError } from './errorHandler';
import { query } from '../config/database';
import { AuthRequest } from '../types';

export const protect = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route+', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as { id: number };

      // Get user from database
      const result = await query(
        'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return next(new AppError('User not found', 401));
      }

      req.user = result.rows[0];
      next();
    } catch (error) {
      return next(new AppError('Not authorized to access this route!', 401));
    }
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user?.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
