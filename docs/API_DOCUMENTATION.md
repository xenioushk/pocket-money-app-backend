# 📚 Complete API Documentation

## Base URL

```
http://localhost:5000/api
```

## Interactive Documentation

**Swagger UI**: http://localhost:5000/api-docs

---

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890" (optional)
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

---

## 💼 Job Endpoints

### Create Job

```http
POST /api/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Lawn Mowing Service",
  "description": "Need someone to mow my lawn",
  "category_id": 1,
  "price": 25.00,
  "duration": "1-2 hours",
  "city": "New York",
  "date": "2025-12-30T10:00:00Z"
}
```

### Get All Jobs (with filters)

```http
GET /api/jobs?category_id=1&city=New York&status=active&min_price=10&max_price=50&page=1&limit=20
```

**Query Parameters:**

- `category_id` (integer) - Filter by category
- `city` (string) - Filter by city
- `status` (string) - active | inactive | completed | pending | approved | rejected
- `min_price` (number) - Minimum price
- `max_price` (number) - Maximum price
- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 20, max: 100)

### Get Single Job

```http
GET /api/jobs/:id
```

Returns job details with images and user information.

### Update Job

```http
PUT /api/jobs/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 30.00
  // Any fields to update
}
```

### Delete Job

```http
DELETE /api/jobs/:id
Authorization: Bearer {token}
```

### Update Job Status

```http
PATCH /api/jobs/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "active"
}
```

### Get User's Jobs

```http
GET /api/jobs/user/:userId
```

---

## 📁 Category Endpoints

### Get All Categories

```http
GET /api/categories
```

### Get Category by Slug

```http
GET /api/categories/:slug

Example: GET /api/categories/lawn-mowing
```

### Create Category (Admin Only)

```http
POST /api/categories
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "New Category",
  "slug": "new-category",
  "description": "Category description"
}
```

### Update Category (Admin Only)

```http
PUT /api/categories/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Updated Name"
}
```

### Delete Category (Admin Only)

```http
DELETE /api/categories/:id
Authorization: Bearer {admin_token}
```

---

## 👤 User Profile Endpoints

### Get Profile

```http
GET /api/users/me
Authorization: Bearer {token}
```

### Update Profile

```http
PUT /api/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "9876543210"
}
```

### Change Password

```http
PATCH /api/users/me/password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

### Delete Account

```http
DELETE /api/users/me
Authorization: Bearer {token}
```

---

## ⭐ Favorites Endpoints

### Add to Favorites

```http
POST /api/favorites
Authorization: Bearer {token}
Content-Type: application/json

{
  "job_id": 5
}
```

### Get User Favorites

```http
GET /api/favorites
Authorization: Bearer {token}
```

Returns list of favorited jobs with full job details.

### Remove from Favorites

```http
DELETE /api/favorites/:jobId
Authorization: Bearer {token}
```

---

## 🔍 Search Endpoint

### Search Jobs

```http
GET /api/search?q=lawn&page=1&limit=20
```

**Query Parameters:**

- `q` (string, required) - Search query
- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 20, max: 100)

Searches in:

- Job title
- Job description
- City name
- Category name

---

## 🖼️ Image Endpoints

### Upload Images

```http
POST /api/jobs/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

images: [file1, file2, file3]
```

**Limitations:**

- Max 5 images per upload
- Allowed formats: JPEG, JPG, PNG, GIF, WebP
- Max file size: 5MB per image
- First uploaded image becomes primary if no images exist

### Get Job Images

```http
GET /api/jobs/:id/images
```

Returns all images for a job, ordered by primary status and creation date.

### Delete Image

```http
DELETE /api/jobs/:id/images/:imageId
Authorization: Bearer {token}
```

If deleted image was primary, automatically sets another image as primary.

### Set Primary Image

```http
PATCH /api/jobs/:id/images/:imageId/primary
Authorization: Bearer {token}
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Success with Pagination

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔒 Authorization Levels

| Endpoint                      | Access Level               |
| ----------------------------- | -------------------------- |
| Auth endpoints                | Public (except logout, me) |
| Job create/update/delete      | Job owner only             |
| Job view/list                 | Public                     |
| Category view                 | Public                     |
| Category create/update/delete | Admin only                 |
| User profile                  | Owner only                 |
| Favorites                     | Owner only                 |
| Search                        | Public                     |
| Image upload/delete           | Job owner only             |
| Image view                    | Public                     |

---

## ⚠️ Error Codes

| Code | Meaning                                              |
| ---- | ---------------------------------------------------- |
| 200  | Success                                              |
| 201  | Created                                              |
| 400  | Bad Request / Validation Error                       |
| 401  | Unauthorized (no token or invalid token)             |
| 403  | Forbidden (valid token but insufficient permissions) |
| 404  | Not Found                                            |
| 429  | Too Many Requests (rate limit exceeded)              |
| 500  | Internal Server Error                                |

---

## 🔑 Authentication Flow

1. **Register** → `POST /api/auth/register`
2. **Login** → `POST /api/auth/login` → Receive `token` and `refreshToken`
3. **Use Token** → Add `Authorization: Bearer {token}` header to protected requests
4. **Refresh Token** → When token expires, use `POST /api/auth/refresh` with `refreshToken`
5. **Logout** → `POST /api/auth/logout` (invalidates tokens)

---

## 📝 Common Workflows

### Creating a Job with Images

1. Login to get token
2. Create job: `POST /api/jobs`
3. Upload images: `POST /api/jobs/:id/images`
4. Optionally set primary: `PATCH /api/jobs/:id/images/:imageId/primary`

### Searching and Filtering

1. Text search: `GET /api/search?q=keyword`
2. Category filter: `GET /api/jobs?category_id=1`
3. Combined: `GET /api/jobs?category_id=1&city=Boston&min_price=20`

### Managing Favorites

1. Browse jobs: `GET /api/jobs`
2. Add favorite: `POST /api/favorites` with `job_id`
3. View favorites: `GET /api/favorites`
4. Remove: `DELETE /api/favorites/:jobId`

---

## 🧪 Testing with cURL

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Job",
    "description": "This is a test",
    "category_id": 1,
    "price": 25,
    "city": "Boston",
    "date": "2025-12-31T10:00:00Z"
  }'
```

---

## 🎯 Rate Limiting

All endpoints are rate-limited to:

- **100 requests per 15 minutes** per IP address

If exceeded, you'll receive a `429 Too Many Requests` error.

---

## 📦 Example Responses

### Job Object

```json
{
  "id": 1,
  "user_id": 5,
  "title": "Lawn Mowing",
  "description": "Need lawn mowed",
  "category_id": 1,
  "price": 25.0,
  "duration": "1 hour",
  "city": "Boston",
  "date": "2025-12-30T10:00:00Z",
  "status": "active",
  "created_at": "2025-12-29T08:00:00Z",
  "updated_at": "2025-12-29T08:00:00Z",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "category_name": "Lawn Mowing",
  "images": [
    {
      "id": 1,
      "image_url": "/uploads/image-123456.jpg",
      "is_primary": true
    }
  ]
}
```

### Category Object

```json
{
  "id": 1,
  "name": "Lawn Mowing",
  "slug": "lawn-mowing",
  "description": "Lawn care and mowing services",
  "created_at": "2025-12-29T00:00:00Z"
}
```

### User Object

```json
{
  "id": 5,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "1234567890",
  "role": "user",
  "created_at": "2025-12-29T08:00:00Z"
}
```

---

**For detailed request/response schemas and try-it-out functionality, visit:**
**http://localhost:5000/api-docs**
