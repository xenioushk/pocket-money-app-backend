# 🏗️ Complete Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                          │
│                   (Your Next Project)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ API Calls
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js Backend (TypeScript)                │
│  ┌───────────────────────────────────────────────────┐     │
│  │  Routes Layer                                     │     │
│  │  - /api/auth     - /api/jobs      - /api/users   │     │
│  │  - /api/categories - /api/favorites - /api/search│     │
│  └─────────────┬─────────────────────────────────────┘     │
│                │                                            │
│  ┌─────────────▼─────────────────────────────────────┐     │
│  │  Middleware Layer                                 │     │
│  │  - JWT Auth  - Validation  - Upload  - Errors    │     │
│  └─────────────┬─────────────────────────────────────┘     │
│                │                                            │
│  ┌─────────────▼─────────────────────────────────────┐     │
│  │  Controllers Layer                                │     │
│  │  Business logic for each resource                 │     │
│  └─────────────┬─────────────────────────────────────┘     │
└────────────────┼────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
┌───────────────┐  ┌──────────────┐
│   Supabase    │  │  Cloudinary  │
│  (PostgreSQL) │  │   (Images)   │
│               │  │              │
│  - Users      │  │  - Job Photos│
│  - Jobs       │  │  - CDN URLs  │
│  - Categories │  │              │
│  - Images     │  │              │
│  - Favorites  │  │              │
│  - Sessions   │  │              │
└───────────────┘  └──────────────┘
```

---

## Data Flow Example: Creating a Job with Images

```
1. User Action (Frontend)
   ↓
2. POST /api/jobs (Create Job)
   → Validate token (JWT middleware)
   → Validate input (express-validator)
   → Insert into Supabase jobs table
   → Return job ID
   ↓
3. POST /api/jobs/:id/images (Upload Images)
   → Validate token
   → Check job ownership
   → Upload to Cloudinary (multer + cloudinary)
   → Get Cloudinary URLs
   → Save URLs to Supabase images table
   → Return image data
   ↓
4. Response to Frontend
   → Job created with images
   → Display success message
```

---

## Technology Stack

### Backend Framework

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety

### Database

- **Supabase** (PostgreSQL) - Cloud database
- **pg** - PostgreSQL driver
- **Connection pooling** - Efficient connections

### Storage

- **Cloudinary** - Image hosting & CDN
- **multer-storage-cloudinary** - Upload integration

### Authentication

- **JWT** - Access tokens
- **bcrypt** - Password hashing
- **Refresh tokens** - Long-lived sessions

### Validation & Security

- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **express-rate-limit** - DDoS protection

### Documentation

- **Swagger/OpenAPI** - Interactive API docs
- **swagger-jsdoc** - Generate from comments
- **swagger-ui-express** - UI interface

---

## Database Schema

```sql
┌──────────────────────────────────────────────────────┐
│ users                                                │
├──────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                   │
│ email           VARCHAR(255) UNIQUE                  │
│ password_hash   VARCHAR(255)                         │
│ first_name      VARCHAR(100)                         │
│ last_name       VARCHAR(100)                         │
│ phone           VARCHAR(20)                          │
│ role            VARCHAR(20) DEFAULT 'user'           │
│ is_banned       BOOLEAN DEFAULT false                │
│ created_at      TIMESTAMP                            │
│ updated_at      TIMESTAMP                            │
└──────────────────────────────────────────────────────┘
                    │
                    │ 1:N
                    ▼
┌──────────────────────────────────────────────────────┐
│ jobs                                                 │
├──────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                   │
│ user_id         INTEGER → users(id)                  │
│ category_id     INTEGER → categories(id)             │
│ title           VARCHAR(255)                         │
│ description     TEXT                                 │
│ price           DECIMAL(10,2)                        │
│ duration        VARCHAR(50)                          │
│ city            VARCHAR(100)                         │
│ date            TIMESTAMP                            │
│ status          VARCHAR(20)                          │
│ created_at      TIMESTAMP                            │
│ updated_at      TIMESTAMP                            │
└──────────────────────────────────────────────────────┘
         │                           │
         │ 1:N                       │ 1:N
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│ images          │         │ favorites        │
├─────────────────┤         ├──────────────────┤
│ id              │         │ id               │
│ job_id →        │         │ user_id →        │
│ image_url       │         │ job_id →         │
│ is_primary      │         │ created_at       │
│ created_at      │         └──────────────────┘
└─────────────────┘

┌──────────────────────────────────────────────────────┐
│ categories                                           │
├──────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                   │
│ name            VARCHAR(100)                         │
│ slug            VARCHAR(100) UNIQUE                  │
│ description     TEXT                                 │
│ created_at      TIMESTAMP                            │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ sessions                                             │
├──────────────────────────────────────────────────────┤
│ id              SERIAL PRIMARY KEY                   │
│ user_id         INTEGER → users(id)                  │
│ token           TEXT                                 │
│ refresh_token   TEXT                                 │
│ expires_at      TIMESTAMP                            │
│ created_at      TIMESTAMP                            │
└──────────────────────────────────────────────────────┘
```

---

## API Endpoints Summary

### Authentication (5 endpoints)

```
POST   /api/auth/register      Create account
POST   /api/auth/login         Get JWT token
POST   /api/auth/logout        Invalidate session
POST   /api/auth/refresh       Refresh access token
GET    /api/auth/me            Get current user
```

### Jobs (7 endpoints)

```
POST   /api/jobs               Create job (auth)
GET    /api/jobs               List with filters
GET    /api/jobs/:id           Get single job
PUT    /api/jobs/:id           Update job (owner)
DELETE /api/jobs/:id           Delete job (owner)
PATCH  /api/jobs/:id/status    Update status
GET    /api/jobs/user/:userId  User's jobs
```

### Categories (5 endpoints)

```
GET    /api/categories         List all
GET    /api/categories/:slug   Get by slug
POST   /api/categories         Create (admin)
PUT    /api/categories/:id     Update (admin)
DELETE /api/categories/:id     Delete (admin)
```

### Users (4 endpoints)

```
GET    /api/users/me           Get profile (auth)
PUT    /api/users/me           Update profile (auth)
PATCH  /api/users/me/password  Change password (auth)
DELETE /api/users/me           Delete account (auth)
```

### Favorites (3 endpoints)

```
POST   /api/favorites          Add favorite (auth)
GET    /api/favorites          List favorites (auth)
DELETE /api/favorites/:jobId   Remove favorite (auth)
```

### Search (1 endpoint)

```
GET    /api/search?q=keyword   Search jobs
```

### Images (4 endpoints)

```
POST   /api/jobs/:id/images              Upload (auth)
GET    /api/jobs/:id/images              List images
DELETE /api/jobs/:id/images/:imageId     Delete (auth)
PATCH  /api/jobs/:id/images/:imageId/primary  Set primary (auth)
```

**Total: 29 endpoints** (28 + 1 health check)

---

## Security Features

### 🔐 Authentication

- JWT access tokens (7 day expiry)
- Refresh tokens (30 day expiry)
- bcrypt password hashing (salt rounds: 10)
- Session tracking in database

### 🛡️ Authorization

- Role-based access (user/admin)
- Resource ownership checks
- Protected routes with middleware

### 🔒 Input Validation

- express-validator on all inputs
- Type checking with TypeScript
- SQL injection prevention (parameterized queries)

### 🚦 Rate Limiting

- 100 requests per 15 minutes
- Per IP address tracking
- Prevents DDoS attacks

### 🎯 Security Headers

- helmet.js middleware
- XSS protection
- CORS configuration
- Content Security Policy

---

## Deployment Architecture

```
Production Setup:

Frontend (Vercel/Netlify)
    ↓ HTTPS
Backend (Render.com/Railway)
    ↓ SSL/TLS
┌─────────────────────┬─────────────────────┐
│                     │                     │
Supabase             Cloudinary            Email
(Database)           (Images)              (SendGrid)
```

### Environment Variables by Service

**Backend Server:**

- `NODE_ENV=production`
- `PORT=5000`
- All DB\_\* variables (Supabase)
- All CLOUDINARY\_\* variables
- JWT secrets
- CORS_ORIGIN (frontend URL)

**Supabase:**

- Automatic backups
- Connection pooling
- SSL enabled

**Cloudinary:**

- CDN enabled
- Image transformations
- Auto-optimization

---

## Performance Features

### Database

- Connection pooling (max 20)
- Indexed foreign keys
- Query optimization logging

### Images

- Cloudinary CDN delivery
- Auto-resize (max 1000x1000)
- Format optimization
- Lazy loading support

### Caching (Future)

- Redis for sessions
- API response caching
- Rate limit caching

---

## Monitoring & Logs

### Built-in Logging

- Database query timing
- API request logging
- Error tracking with stack traces

### Supabase Dashboard

- Real-time query monitoring
- Connection stats
- Table editor

### Cloudinary Dashboard

- Upload statistics
- Bandwidth usage
- Storage metrics

---

## File Structure

```
pocket-money-app-backend/
├── src/
│   ├── config/
│   │   ├── config.ts          # Environment config
│   │   ├── database.ts        # PostgreSQL setup
│   │   └── swagger.ts         # API docs config
│   ├── controllers/           # Business logic (7 files)
│   ├── middleware/            # Auth, validation, upload, errors
│   ├── routes/                # API routes (8 files)
│   ├── database/
│   │   ├── migrations/        # SQL schema
│   │   └── seeds/             # Initial data
│   ├── types/                 # TypeScript interfaces
│   ├── app.ts                 # Express app setup
│   └── server.ts              # Entry point
├── dist/                      # Compiled JavaScript
├── uploads/                   # Temp local uploads
├── .env                       # Environment variables (gitignored)
├── .env.example               # Template
├── package.json
├── tsconfig.json
└── Documentation/             # All .md guides
```

---

## What Makes This Backend Production-Ready?

✅ **Type Safety** - Full TypeScript with strict mode
✅ **Security** - JWT, bcrypt, helmet, rate limiting, CORS
✅ **Validation** - All inputs validated
✅ **Error Handling** - Centralized error middleware
✅ **Documentation** - Interactive Swagger API docs
✅ **Scalability** - Connection pooling, cloud services
✅ **Cloud Native** - Supabase + Cloudinary
✅ **Code Quality** - ESLint configured
✅ **Best Practices** - MVC pattern, separation of concerns

---

## Next Steps for Frontend Integration

1. **Base URL**: `http://localhost:5000/api` (dev)
2. **Authentication**: Store JWT in localStorage/cookies
3. **Image Display**: Use Cloudinary URLs directly
4. **Error Handling**: Check `success` field in responses
5. **File Uploads**: Use FormData for multipart requests

---

**Your backend is enterprise-grade and ready for production!** 🚀
