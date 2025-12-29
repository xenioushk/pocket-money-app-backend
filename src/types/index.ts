import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Job {
  id: number;
  user_id: number;
  title: string;
  description: string;
  category_id: number;
  price: number;
  duration?: string;
  city: string;
  date: Date;
  status:
    | 'active'
    | 'inactive'
    | 'completed'
    | 'pending'
    | 'approved'
    | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: Date;
}

export interface Session {
  id: number;
  user_id: number;
  token: string;
  refresh_token?: string;
  expires_at: Date;
  created_at: Date;
}

export interface Favorite {
  id: number;
  user_id: number;
  job_id: number;
  created_at: Date;
}

export interface Image {
  id: number;
  job_id: number;
  image_url: string;
  is_primary: boolean;
  created_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  };
}

export interface Config {
  nodeEnv: string;
  port: number;
  db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  corsOrigin: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  maxFileSize: number;
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  email: {
    host?: string;
    port: number;
    user?: string;
    password?: string;
    from: string;
  };
}
