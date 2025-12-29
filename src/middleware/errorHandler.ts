import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging
  if (config.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  // PostgreSQL duplicate key error
  if (err.code === '23505') {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // Validation error
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
