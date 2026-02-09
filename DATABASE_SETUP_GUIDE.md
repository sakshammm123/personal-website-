# 🗄️ PostgreSQL Database Setup Guide

Your website needs a PostgreSQL database for production. Here are your options:

---

## Option A: Vercel Postgres (Recommended) ⭐

**Best for:** Easiest setup, seamless integration with Vercel

### Pros:
- ✅ **Easiest to set up** - Built into Vercel dashboard
- ✅ **Automatic integration** - Environment variables set automatically
- ✅ **Free tier available** - 256 MB storage, 60 hours compute/month
- ✅ **No separate account needed** - Everything in one place
- ✅ **Automatic backups** - Included
- ✅ **Easy scaling** - Upgrade when needed

### Cons:
- ⚠️ Requires deploying to Vercel first (but you can set it up during deployment)

### Setup Steps:
1. **After deploying to Vercel** (we'll do this next)
2. Go to your project → **Storage** tab
3. Click **"Create Database"** → Select **"Postgres"**
4. Name it (e.g., "production-db")
5. Vercel automatically adds `POSTGRES_URL` environment variable
6. Update `DATABASE_URL` to use `$POSTGRES_URL` in environment variables

### Pricing:
- **Free:** 256 MB storage, 60 hours compute/month
- **Pro:** $20/month - 10 GB storage, unlimited compute
- **Enterprise:** Custom pricing

**Connection String Format:**
```
postgresql://user:password@host:port/database?sslmode=require
```

---

## Option B: Neon (Free Tier) 🆓

**Best for:** Free, serverless PostgreSQL, separate from hosting

### Pros:
- ✅ **Completely free tier** - 0.5 GB storage, generous compute
- ✅ **Serverless** - Auto-scales, pay for what you use
- ✅ **Fast setup** - 2 minutes
- ✅ **Separate from hosting** - Can use with any platform
- ✅ **Branching** - Create database branches (like Git)
- ✅ **Great for development** - Free tier is generous

### Cons:
- ⚠️ Requires separate account
- ⚠️ Need to manually add connection string to Vercel

### Setup Steps:

1. **Sign Up:**
   - Go to https://neon.tech
   - Click "Sign Up" (use GitHub for fastest signup)
   - Verify your email

2. **Create Project:**
   - Click **"Create a project"**
   - Name it: `saksham-website-production`
   - Select region closest to you (e.g., US East)
   - Click **"Create project"**

3. **Get Connection String:**
   - After project is created, you'll see a connection string
   - It looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`
   - **Copy this entire string** - you'll need it for Vercel

4. **Save Connection String:**
   - Keep it safe - you'll add it to Vercel environment variables as `DATABASE_URL`

### Pricing:
- **Free:** 0.5 GB storage, 0.5 compute hours/day
- **Launch:** $19/month - 10 GB storage, more compute
- **Scale:** $69/month - 50 GB storage

**Connection String Example:**
```
postgresql://neondb_owner:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## Option C: Supabase (Free Tier) 🔥

**Best for:** Full-featured backend, includes dashboard and API

### Pros:
- ✅ **Free tier** - 500 MB database, 2 GB bandwidth
- ✅ **Full dashboard** - Visual database management
- ✅ **Built-in API** - REST and GraphQL APIs
- ✅ **Real-time features** - If you need them later
- ✅ **Auth included** - Can use instead of NextAuth (optional)
- ✅ **Storage included** - File storage built-in

### Cons:
- ⚠️ More features than you might need
- ⚠️ Requires separate account

### Setup Steps:

1. **Sign Up:**
   - Go to https://supabase.com
   - Click "Start your project"
   - Sign up with GitHub

2. **Create Project:**
   - Click **"New Project"**
   - Name: `saksham-website`
   - Database password: **Generate a strong password** (save it!)
   - Region: Choose closest to you
   - Click **"Create new project"**
   - Wait 2-3 minutes for setup

3. **Get Connection String:**
   - Go to **Settings** → **Database**
   - Scroll to **"Connection string"**
   - Select **"URI"** tab
   - Copy the connection string
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

4. **Replace Password:**
   - Replace `[YOUR-PASSWORD]` with the password you saved
   - This is your `DATABASE_URL`

### Pricing:
- **Free:** 500 MB database, 2 GB bandwidth, 50,000 monthly active users
- **Pro:** $25/month - 8 GB database, 50 GB bandwidth
- **Team:** $599/month - 32 GB database, 250 GB bandwidth

**Connection String Example:**
```
postgresql://postgres.xxxxx:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

---

## Comparison Table

| Feature | Vercel Postgres | Neon | Supabase |
|---------|----------------|------|----------|
| **Free Tier** | 256 MB | 0.5 GB | 500 MB |
| **Setup Time** | 2 min (after Vercel deploy) | 2 min | 3 min |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Dashboard** | Basic | Basic | Full-featured |
| **Best For** | Vercel users | Simple projects | Full backend needs |

---

## My Recommendation 💡

**For your first deployment:** Use **Vercel Postgres** (Option A)
- Easiest setup
- Everything in one place
- Free tier is sufficient for starting
- Can migrate later if needed

**If you want separation:** Use **Neon** (Option B)
- Completely free
- Fast and simple
- Good for learning

**If you want more features:** Use **Supabase** (Option C)
- Full dashboard
- More features if you need them later

---

## What You'll Need After Setup

Once you have your database, you'll need:

1. **Connection String** - Looks like:
   ```
   postgresql://user:password@host:port/database?sslmode=require
   ```

2. **Add to Vercel** - As `DATABASE_URL` environment variable

3. **Run Migrations** - After deployment, run:
   ```bash
   npx prisma migrate deploy
   ```

---

## Next Steps After Choosing

1. **Choose your option** (I recommend Vercel Postgres)
2. **Set up the database** (follow steps above)
3. **Save the connection string** (you'll need it for Vercel)
4. **Continue to Vercel deployment** (we'll add it there)

---

## Need Help?

- **Vercel Postgres Docs:** https://vercel.com/docs/storage/vercel-postgres
- **Neon Docs:** https://neon.tech/docs
- **Supabase Docs:** https://supabase.com/docs

---

**Ready to proceed?** Let me know which option you'd like to use!
