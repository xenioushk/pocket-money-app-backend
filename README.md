# Pocket Money App - Backend API

A comprehensive RESTful API for a pocket money/odd jobs marketplace application built with **TypeScript**, **Node.js**, **Express**, and **PostgreSQL**.

## 🌟 Features

- 🔐 **Authentication & Security**
  - JWT-based authentication with refresh tokens
  - Password hashing with bcrypt
  - Rate limiting and security headers
  - Input validation and sanitization
  - SQL injection protection

- 📋 **Core Functionality**
  - User registration and authentication
  - Job posting and management
  - Category management
  - Advanced search and filtering
  - Favorites system
  - Image upload for jobs

- 📚 **API Documentation**
  - Interactive Swagger/OpenAPI documentation
  - Auto-generated API specs
  - Try-it-out functionality

- 🎯 **Type Safety**
  - Full TypeScript implementation
  - Type definitions for all models
  - Enhanced developer experience

## 🛠 Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **File Upload**: multer
- **Security**: helmet, cors, express-rate-limit
- **Documentation**: Swagger/OpenAPI

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- TypeScript knowledge (recommended)

## 🚀 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pocket-money-app-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pocket_money_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CORS_ORIGIN=http://localhost:3000
```

5. Create PostgreSQL database:

```bash
createdb pocket_money_db
```

6. Build the TypeScript project:

```bash
npm run build
```

7. Run database migrations:

```bash
npm run migrate
```

8. Seed the database with categories:

```bash
npm run seed
```

## 📖 Usage

### Development

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### API Documentation

Access the interactive Swagger documentation at:

```
http://localhost:5000/api-docs
```

### Production

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

### Database Commands

- **Run migrations**: `npm run migrate`
- **Seed database**: `npm run seed`
- **Reset database**: `npm run db:reset` (⚠️ Deletes all data)

### Code Quality

```bash
# Check for lint errors
npm run lint

# Fix lint errors automatically
npm run lint:fix
```

## API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Jobs

#### Create Job

```http
POST /api/jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Lawn Mowing",
  "description": "Need help mowing my lawn",
  "categoryId": 1,
  "price": 25.00,
  "duration": "2 hours",
  "city": "New York",
  "date": "2025-01-15"
}
```

#### Get All Jobs

```http
GET /api/jobs?page=1&limit=10&category=lawn-mowing&city=New York
```

#### Get Single Job

```http
GET /api/jobs/:id
```

#### Update Job

```http
PUT /api/jobs/:id
Authorization: Bearer <token>
```

#### Delete Job

```http
DELETE /api/jobs/:id
Authorization: Bearer <token>
```

#### Upload Images

```http
POST /api/jobs/:id/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: [file1, file2, ...]
```

### Categories

#### Get All Categories

```http
GET /api/categories
```

### Search

#### Search Jobs

```http
GET /api/search?q=lawn&city=New York&minPrice=10&maxPrice=50
```

### Favorites

#### Add to Favorites

```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": 1
}
```

#### Get Favorites

```http
GET /api/favorites
Authorization: Bearer <token>
```

## 📁 Project Structure

```
src/
├── types/                 # TypeScript type definitions
│   └── index.ts
├── config/
│   ├── config.ts          # Configuration
│   ├── database.ts        # Database connection
│   └── swagger.ts         # Swagger configuration
├── controllers/           # Route controllers (TypeScript)
├── middleware/            # Custom middleware (TypeScript)
├── routes/                # API routes (TypeScript)
├── database/
│   ├── migrations/        # SQL migration files
│   ├── seeds/             # Seed data
│   └── migrate.ts         # Migration runner
├── app.ts                 # Express app setup
└── server.ts              # Server entry point
```

## 🗄 Database Schema

- **users** - User accounts with authentication
- **categories** - Job categories (15 predefined)
- **jobs** - Job listings with full details
- **sessions** - JWT session management
- **favorites** - User favorite jobs (many-to-many)
- **images** - Job images with primary image support

## 🔒 Security Features

✅ Helmet.js for security headers  
✅ CORS protection  
✅ Rate limiting (100 requests per 15 min)  
✅ JWT authentication & refresh tokens  
✅ Password hashing (bcrypt)  
✅ Input validation (express-validator)  
✅ SQL injection protection  
✅ XSS protection  
✅ TypeScript for type safety

## 🚀 Deployment

### Render.com

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy

### Database (Supabase)

1. Create a new project on Supabase
2. Get connection string
3. Update environment variables
4. Run migrations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
