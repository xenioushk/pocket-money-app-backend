# Quick Start Guide

## Prerequisites Setup

### 1. Install PostgreSQL

**macOS (using Homebrew):**

```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**
Download and install from https://www.postgresql.org/download/windows/

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE pocket_money_db;

# Create user (optional)
CREATE USER pocket_money_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pocket_money_db TO pocket_money_user;

# Exit
\q
```

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update your database credentials
# Important: Update DB_PASSWORD if you set one
```

### 3. Set Up Database

```bash
# Run migrations (creates tables)
npm run migrate

# Seed categories
npm run seed
```

### 4. Start Development Server

```bash
npm run dev
```

The server should now be running at `http://localhost:5000`

## Testing the API

### 1. Check Health Endpoint

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-12-29T..."
}
```

### 2. Get Categories

```bash
curl http://localhost:5000/api/categories
```

### 3. Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Save the `token` from the response for authenticated requests.

### 4. Create a Job (requires authentication)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Lawn Mowing",
    "description": "Need help mowing my lawn",
    "categoryId": 1,
    "price": 25.00,
    "city": "New York",
    "date": "2025-01-15"
  }'
```

## Common Commands

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Run migrations
npm run migrate

# Seed database
npm run seed

# Reset database (WARNING: deletes all data)
npm run db:reset

# Run tests
npm test

# Lint code
npm run lint

# Fix lint errors
npm run lint:fix
```

## Troubleshooting

### Database Connection Error

- Check PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Verify database credentials in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use

- Change PORT in `.env` file
- Kill process using the port: `lsof -ti:5000 | xargs kill`

### Migration Errors

- Reset database: `npm run db:reset`
- Check PostgreSQL logs

## Next Steps

1. Import `postman_collection.json` into Postman for easy API testing
2. Review the API documentation in `README.md`
3. Start building your frontend React app
4. Deploy to Render.com (see deployment guide in README.md)

## Support

If you encounter any issues:

1. Check the error logs
2. Verify environment variables
3. Ensure database is running and accessible
4. Review the README.md for detailed documentation
