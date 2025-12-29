import swaggerJsdoc from 'swagger-jsdoc';
import config from './config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pocket Money App API',
      version: '1.0.0',
      description:
        'RESTful API for a pocket money/odd jobs marketplace application',
      contact: {
        name: 'API Support',
        email: 'support@pocketmoney.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://your-production-url.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'integer' },
            price: { type: 'number', format: 'float' },
            duration: { type: 'string' },
            city: { type: 'string' },
            date: { type: 'string', format: 'date' },
            status: {
              type: 'string',
              enum: [
                'active',
                'inactive',
                'completed',
                'pending',
                'approved',
                'rejected',
              ],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            jobId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Image: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            jobId: { type: 'integer' },
            imageUrl: { type: 'string' },
            isPrimary: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API routes and controllers
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
