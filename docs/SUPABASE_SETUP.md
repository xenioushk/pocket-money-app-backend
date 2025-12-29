# 🗄️ Supabase Database Connection Guide

## Overview

Your backend uses PostgreSQL, and **Supabase is PostgreSQL in the cloud**, so they're 100% compatible! No code changes needed - just update your connection credentials.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Project Name**: `pocket-money-app`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you (e.g., US East, Europe West)
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### Step 2: Get Connection Details

1. In your Supabase project, go to **Settings** (⚙️ icon in sidebar)
2. Click **"Database"**
3. Scroll to **"Connection string"** section
4. Select **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```

### Step 3: Update .env File

Replace your local database credentials with Supabase:

```env
# OLD (Local PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pocket_money_db
DB_USER=postgres
DB_PASSWORD=your_local_password

# NEW (Supabase)
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

**Or use the full connection string format:**

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

---

## 📝 Detailed Instructions

### Getting Supabase Credentials

From your Supabase Dashboard → Settings → Database:

| Field         | Where to Find                | Example                      |
| ------------- | ---------------------------- | ---------------------------- |
| `DB_HOST`     | Connection string → Host     | `db.abcdefghijk.supabase.co` |
| `DB_PORT`     | Connection string → Port     | `5432`                       |
| `DB_NAME`     | Connection string → Database | `postgres`                   |
| `DB_USER`     | Connection string → User     | `postgres`                   |
| `DB_PASSWORD` | Password you created         | Your password                |

### Connection String Format

Supabase provides connection strings in this format:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

Break it down:

- **User**: `postgres`
- **Password**: `[YOUR-PASSWORD]`
- **Host**: `db.xxxxxxxxxxxxx.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`

---

## 🔧 Configuration Options

### Option 1: Individual Environment Variables (Current Setup)

This is what your backend already uses:

```env
# .env
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
```

**No code changes needed!** ✅

### Option 2: Connection String (Alternative)

If you prefer using a single DATABASE_URL, you can modify [config.ts](src/config/config.ts):

```typescript
// Option to parse DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  // Parse connection string
  const url = new URL(databaseUrl);
  config.db.host = url.hostname;
  config.db.port = parseInt(url.port || '5432');
  config.db.database = url.pathname.slice(1);
  config.db.user = url.username;
  config.db.password = url.password;
}
```

But **Option 1 is recommended** - it's already set up!

---

## 🗃️ Running Migrations on Supabase

After connecting to Supabase, you need to create your tables:

### Method 1: Run Migration Script (Recommended)

```bash
npm run migrate
```

This runs your existing migration file ([001_create_tables.sql](src/database/migrations/001_create_tables.sql)).

### Method 2: Use Supabase SQL Editor

1. Go to Supabase Dashboard
2. Click **SQL Editor** in sidebar
3. Click **"New query"**
4. Copy contents of `src/database/migrations/001_create_tables.sql`
5. Paste and click **"Run"**

### Method 3: Direct psql Connection

```bash
psql "postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres" \
  -f src/database/migrations/001_create_tables.sql
```

---

## 🌱 Seeding Data

After migrations, seed your categories:

### Method 1: Run Seed Script

```bash
npm run seed
```

### Method 2: Supabase SQL Editor

1. Copy contents of `src/database/seeds/001_seed_categories.sql`
2. Run in SQL Editor

---

## ✅ Testing Connection

### Test 1: Check Connection

```bash
npm run dev
```

Look for:

```
✅ Database connected successfully
Server running on port 5000
```

### Test 2: Run a Query

Try registering a user or fetching categories:

```bash
curl http://localhost:5000/api/categories
```

### Test 3: Verify in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. You should see your tables: `users`, `jobs`, `categories`, etc.

---

## 🔒 Security Best Practices

### 1. Use Environment Variables

Never commit your Supabase password to git!

```env
# ✅ GOOD - In .env (not committed)
DB_PASSWORD=your_actual_password

# ❌ BAD - In code
const password = "my_password_123"
```

### 2. Connection Pooling (Already Configured)

Your backend uses connection pooling with sensible defaults:

```typescript
max: 20,                      // Max 20 connections
idleTimeoutMillis: 30000,     // Close idle connections after 30s
connectionTimeoutMillis: 2000 // Timeout after 2s
```

This works perfectly with Supabase!

### 3. SSL/TLS (Automatic)

Supabase requires SSL by default. Your `pg` library handles this automatically.

If you get SSL errors, you can add:

```typescript
// In config/config.ts
db: {
  // ... existing config
  ssl: {
    rejectUnauthorized: false;
  }
}
```

But this is usually not needed.

---

## 🌐 Production vs Development

### Development (.env.local or .env)

```env
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=dev_password_here
```

### Production (Deployment Platform)

When deploying (e.g., to Render, Railway, Vercel):

1. Go to your platform's environment variables
2. Add the same DB\_\* variables
3. OR use DATABASE_URL if platform provides it

**Tip**: Many platforms auto-detect DATABASE*URL and set DB*\* variables for you.

---

## 🔄 Migration from Local to Supabase

### Export Local Data (Optional)

If you have test data in local PostgreSQL:

```bash
# Export data
pg_dump -U postgres -d pocket_money_db --data-only > backup.sql

# Import to Supabase
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < backup.sql
```

### Fresh Start (Recommended)

Just run migrations and seeds on Supabase - start fresh!

```bash
npm run migrate
npm run seed
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"

- Check your DB_HOST is correct (from Supabase dashboard)
- Verify DB_PASSWORD has no typos
- Ensure port 5432 is accessible (firewall)

### Error: "Password authentication failed"

- Double-check your password
- Password might contain special characters - wrap in quotes in .env:
  ```env
  DB_PASSWORD="p@ssw0rd!123"
  ```

### Error: "Database does not exist"

- Supabase database is always named `postgres`
- Set `DB_NAME=postgres` in .env

### Error: "Too many connections"

- Reduce `max` in connection pool config
- Supabase free tier has connection limits

### Tables not found

- Run migrations: `npm run migrate`
- Or create tables manually in Supabase SQL Editor

---

## 📊 Monitoring & Management

### Supabase Dashboard Features:

1. **Table Editor**: Browse/edit data visually
2. **SQL Editor**: Run custom queries
3. **Database**: View connection stats, backups
4. **Logs**: See real-time queries
5. **API Docs**: Auto-generated REST/GraphQL APIs (optional)

### Useful SQL Queries:

```sql
-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Count records
SELECT
  'users' as table, COUNT(*) FROM users
UNION ALL
SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'categories', COUNT(*) FROM categories;

-- Check connections
SELECT count(*) FROM pg_stat_activity;
```

---

## 🎯 Complete Setup Checklist

- [ ] Create Supabase account
- [ ] Create new project
- [ ] Get connection credentials
- [ ] Update .env file with Supabase credentials
- [ ] Run migrations (`npm run migrate`)
- [ ] Run seeds (`npm run seed`)
- [ ] Test connection (`npm run dev`)
- [ ] Verify tables exist in Supabase Dashboard
- [ ] Test API endpoints (register user, create job, etc.)
- [ ] Commit .env.example (NOT .env!)
- [ ] Set up production environment variables

---

## 🚀 Quick Start Commands

```bash
# 1. Update .env with Supabase credentials
nano .env

# 2. Run migrations
npm run migrate

# 3. Seed categories
npm run seed

# 4. Start server
npm run dev

# 5. Test API
curl http://localhost:5000/api/categories
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase + Node.js Guide](https://supabase.com/docs/guides/api)
- [PostgreSQL Connection Pooling](https://node-postgres.com/features/pooling)

---

## 💡 Pro Tips

1. **Supabase has built-in Auth**: But we're using our own JWT auth (which is fine!)
2. **Supabase has Storage**: Similar to Cloudinary for file uploads
3. **Supabase has Realtime**: For live updates (advanced feature)
4. **Free Tier Limits**: 500MB database, 1GB file storage, 2GB bandwidth

For this project, the free tier is more than enough!

---

## ✨ Summary

**What to do:**

1. Get Supabase credentials
2. Update 5 lines in .env:
   ```env
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PASSWORD=your_supabase_password
   DB_NAME=postgres
   DB_USER=postgres
   DB_PORT=5432
   ```
3. Run migrations
4. Done!

**No code changes needed** - your backend is already compatible! 🎉
