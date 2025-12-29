declare module 'multer-storage-cloudinary' {
  import { StorageEngine } from 'multer';
  import { v2 as cloudinary } from 'cloudinary';

  export interface CloudinaryStorage {
    new (options: {
      cloudinary: typeof cloudinary;
      params:
        | {
            folder?: string;
            format?: string;
            public_id?: string;
            allowed_formats?: string[];
            transformation?: any[];
          }
        | ((
            req: Express.Request,
            file: Express.Multer.File
          ) => Promise<{
            folder?: string;
            format?: string;
            public_id?: string;
            allowed_formats?: string[];
            transformation?: any[];
          }>);
    }): StorageEngine;
  }

  export const CloudinaryStorage: CloudinaryStorage;
}
