# 🚀 Pocket Money App Backend - Quick Reference

## 📦 Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# 3. Build TypeScript
npm run build

# 4. Setup database
createdb pocket_money_db
npm run migrate
npm run seed

# 5. Start development
npm run dev
```

## 🌐 Access Points

- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api-docs
- **Uploaded Images**: http://localhost:5000/uploads/{filename}

## 📝 NPM Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start development server with hot reload |
| `npm run build`    | Compile TypeScript to JavaScript         |
| `npm start`        | Run production server (after build)      |
| `npm run migrate`  | Run database migrations                  |
| `npm run seed`     | Seed database with categories            |
| `npm run db:reset` | ⚠️ Reset database (deletes all data)     |
| `npm run lint`     | Check code quality                       |
| `npm run lint:fix` | Auto-fix linting errors                  |

## 📚 API Endpoints

### Authentication

```http
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
POST   /api/auth/logout      # Logout user (requires auth)
POST   /api/auth/refresh     # Refresh access token
GET    /api/auth/me          # Get current user (requires auth)
```

### Jobs (Not yet converted to TypeScript)

```http
POST   /api/jobs             # Create job (requires auth)
GET    /api/jobs             # Get all jobs (with filters)
GET    /api/jobs/:id         # Get single job
PUT    /api/jobs/:id         # Update job (requires auth)
DELETE /api/jobs/:id         # Delete job (requires auth)
PATCH  /api/jobs/:id/status  # Update job status (requires auth)
GET    /api/jobs/user/:userId # Get user's jobs
```

### Categories

```http
GET    /api/categories       # Get all categories
GET    /api/categories/:slug # Get category by slug
POST   /api/categories       # Create category (admin only)
PUT    /api/categories/:id   # Update category (admin only)
DELETE /api/categories/:id   # Delete category (admin only)
```

### Search

```http
GET    /api/search?q=keyword # Search jobs
```

### Favorites

```http
POST   /api/favorites        # Add to favorites (requires auth)
GET    /api/favorites        # Get user favorites (requires auth)
DELETE /api/favorites/:jobId # Remove from favorites (requires auth)
```

### Users

```http
GET    /api/users/me         # Get profile (requires auth)
PUT    /api/users/me         # Update profile (requires auth)
PATCH  /api/users/me/password # Change password (requires auth)
DELETE /api/users/me         # Delete account (requires auth)
```

### Images

```http
POST   /api/jobs/:id/images          # Upload images (requires auth)
GET    /api/jobs/:id/images          # Get job images
DELETE /api/jobs/:id/images/:imageId # Delete image (requires auth)
PATCH  /api/jobs/:id/images/:imageId/primary # Set primary image
```

## 🔑 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

Get token by:

1. Registering: `POST /api/auth/register`
2. Logging in: `POST /api/auth/login`

## 📊 Example Requests

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🗄️ Database Categories (Seeded)

1. Lawn Mowing
2. Snow Shoveling
3. Dog Walking
4. Tutoring
5. Car Washing
6. Babysitting
7. House Cleaning
8. Grocery Shopping
9. Pet Sitting
10. Moving Help
11. Painting
12. Gardening
13. Tech Support
14. Errand Running
15. Other

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Auth**: JWT
- **Validation**: express-validator
- **Documentation**: Swagger/OpenAPI
- **Security**: helmet, cors, rate-limit
- **File Upload**: multer

## 📁 Project Structure

```
src/
├── types/              # TypeScript interfaces
├── config/             # Configuration files
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── routes/             # API routes
└── database/           # Migrations & seeds
```

## 🔒 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pocket_money_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🐛 Troubleshooting

### Can't connect to database

```bash
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Verify database exists
psql -l
```

### Port already in use

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### TypeScript build errors

```bash
# Clean build
rm -rf dist
npm run build
```

## 📌 Important Notes

- ✅ **TypeScript Migration Complete** - All core files converted
- ⚠️ **Remaining Work**: Other controllers need TS conversion + Swagger docs
- 📚 **API Docs**: Available at `/api-docs` with try-it-out feature
- 🔒 **Security**: JWT auth, rate limiting, input validation all in place
- 🗄️ **Database**: PostgreSQL with migrations and seeds ready

## 🎯 Next Development Steps

1. Convert remaining controllers to TypeScript:
   - jobController
   - categoryController
   - userController
   - favoriteController
   - searchController
   - imageController

2. Add Swagger annotations to all endpoints

3. Write tests (when ready)

4. Deploy to production (Render.com + Supabase)

## 🆘 Support

- Check API documentation at `/api-docs`
- Review `README.md` for detailed info
- See `TYPESCRIPT_MIGRATION.md` for migration details
- Consult `SETUP_GUIDE.md` for setup help
