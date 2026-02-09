# Deployment Guide

This guide covers deploying your Next.js website to a production domain.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Hosting Options](#hosting-options)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Domain Configuration](#domain-configuration)
6. [Post-Deployment Steps](#post-deployment-steps)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] Database is migrated from SQLite to PostgreSQL (recommended for production)
- [ ] Admin account is created
- [ ] Build passes locally (`npm run build`)
- [ ] All sensitive data is in environment variables (not hardcoded)
- [ ] `.env.local` is in `.gitignore` (never commit secrets)

---

## Hosting Options

### Option 1: Vercel (Recommended for Next.js)

**Pros:**
- Built by Next.js creators, optimized for Next.js
- Free tier available
- Automatic deployments from Git
- Built-in SSL certificates
- Edge functions support
- Easy domain configuration

**Steps:**

1. **Install Vercel CLI** (optional, can use web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Or deploy via GitHub:**
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Configure environment variables (see below)
   - Deploy

4. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`

5. **Database Setup:**
   - Use Vercel Postgres (built-in) or external provider
   - Update `DATABASE_URL` in environment variables

---

### Option 2: Railway

**Pros:**
- Easy PostgreSQL setup
- Good for full-stack apps
- Free tier available
- Simple deployment

**Steps:**

1. **Sign up** at [railway.app](https://railway.app)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo" (or upload code)

3. **Add PostgreSQL Database:**
   - Click "+ New" → "Database" → "Add PostgreSQL"
   - Copy the `DATABASE_URL` connection string

4. **Configure Environment Variables:**
   - Go to your service → Variables
   - Add all required variables
   - Set `DATABASE_URL` to the PostgreSQL connection string

5. **Deploy:**
   - Railway auto-detects Next.js
   - Builds and deploys automatically

---

### Option 3: Netlify

**Pros:**
- Good free tier
- Easy Git integration
- Built-in form handling

**Steps:**

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Deploy:**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Configure Environment Variables:**
   - Site settings → Environment variables
   - Add all required variables

4. **Note:** Netlify requires additional config for Next.js API routes. Consider Vercel or Railway for better Next.js support.

---

### Option 4: DigitalOcean App Platform / Render / Fly.io

These are also viable options with similar processes:
- Connect GitHub repository
- Configure build settings
- Set environment variables
- Add PostgreSQL database
- Deploy

---

## Database Setup

### Migrating from SQLite to PostgreSQL

Your current setup uses SQLite (`file:./dev.db`). For production, use PostgreSQL:

1. **Get PostgreSQL Database:**
   - **Vercel:** Use Vercel Postgres (add in dashboard)
   - **Railway:** Add PostgreSQL service
   - **Other:** Use providers like:
     - [Supabase](https://supabase.com) (free tier)
     - [Neon](https://neon.tech) (free tier)
     - [PlanetScale](https://planetscale.com) (free tier)
     - [AWS RDS](https://aws.amazon.com/rds/)
     - [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases)

2. **Update Prisma Schema:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update Environment Variable:**
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   ```

4. **Run Migrations:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy  # For production
   ```

5. **Migrate Data (if needed):**
   - Export SQLite data: `sqlite3 prisma/dev.db .dump > backup.sql`
   - Import to PostgreSQL (may require manual conversion)

---

## Environment Variables

Create these environment variables in your hosting platform:

### Required Variables:

```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"  # Your production URL
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"  # Generate new secret

# Admin Credentials (set after deployment)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# Chatbot (if using)
GEMINI_API_KEY="your_gemini_api_key"
```

### Generating NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### Important Notes:

- **Never commit `.env.local`** to Git
- Use different secrets for production vs development
- Update `NEXTAUTH_URL` to your production domain
- Keep `ADMIN_PASSWORD` secure and strong

---

## Domain Configuration

### Step 1: Purchase Domain

Buy a domain from:
- [Namecheap](https://www.namecheap.com)
- [Google Domains](https://domains.google)
- [Cloudflare](https://www.cloudflare.com/products/registrar/)
- [GoDaddy](https://www.godaddy.com)

### Step 2: Configure DNS

#### For Vercel:

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Vercel provides DNS records to add

2. **In Your Domain Registrar:**
   - Add DNS records as shown in Vercel:
     - **A Record:** `@` → Vercel IP
     - **CNAME:** `www` → `cname.vercel-dns.com`
   - Or use **Nameservers** (easier):
     - Change nameservers to Vercel's nameservers

#### For Railway:

1. **In Railway Dashboard:**
   - Go to your service → Settings → Networking
   - Add custom domain

2. **Configure DNS:**
   - Add **CNAME** record:
     - Name: `www` (or `@` for root)
     - Value: Railway-provided domain

#### For Other Platforms:

- Follow platform-specific instructions
- Generally involves adding CNAME or A records
- Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)

### Step 3: SSL Certificate

Most platforms (Vercel, Railway, Netlify) automatically provision SSL certificates via Let's Encrypt. Ensure:
- DNS is correctly configured
- Platform can verify domain ownership
- SSL will activate automatically

### Step 4: Update Environment Variables

After domain is live, update:
```env
NEXTAUTH_URL="https://yourdomain.com"
```

---

## Post-Deployment Steps

### 1. Verify Build

Ensure production build works:
```bash
npm run build
npm start  # Test production build locally
```

### 2. Run Database Migrations

In production:
```bash
npx prisma migrate deploy
```

Or configure your hosting platform to run this automatically.

### 3. Create Admin Account

SSH into your server or use hosting platform's terminal:
```bash
node scripts/setup-admin.js admin your-secure-password
```

Or create via admin panel if available.

### 4. Test All Features

- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Admin login works
- [ ] Blog editor functions
- [ ] Image uploads work
- [ ] Contact form submits
- [ ] Chatbot works (if enabled)
- [ ] Analytics tracking works

### 5. File Uploads

**Important:** File uploads stored in `public/uploads/` are ephemeral on most platforms. Consider:

- **Option A:** Use cloud storage (recommended):
  - [AWS S3](https://aws.amazon.com/s3/)
  - [Cloudinary](https://cloudinary.com)
  - [Uploadcare](https://uploadcare.com)
  - [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)

- **Option B:** Use persistent volumes (Railway, DigitalOcean)
- **Option C:** Use database for small files (base64)

### 6. Monitoring & Analytics

Set up:
- Error tracking (Sentry, LogRocket)
- Analytics (Google Analytics, Plausible)
- Uptime monitoring (UptimeRobot, Pingdom)

### 7. Backup Strategy

- **Database:** Set up automated backups (most platforms offer this)
- **Files:** Backup uploaded images regularly
- **Code:** Use Git (already done)

---

## Quick Deployment Checklist

- [ ] Choose hosting platform
- [ ] Set up PostgreSQL database
- [ ] Update Prisma schema to PostgreSQL
- [ ] Configure all environment variables
- [ ] Deploy application
- [ ] Run database migrations
- [ ] Purchase and configure domain
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Create admin account
- [ ] Test all functionality
- [ ] Set up file storage (if needed)
- [ ] Configure backups
- [ ] Set up monitoring

---

## Troubleshooting

### Build Fails

- Check Node.js version (should match hosting platform)
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors: `npm run lint`

### Database Connection Errors

- Verify `DATABASE_URL` is correct
- Check database is accessible from hosting platform
- Ensure migrations have run: `npx prisma migrate deploy`

### Environment Variables Not Working

- Restart deployment after adding variables
- Check variable names match exactly (case-sensitive)
- Verify `NEXT_PUBLIC_*` prefix for client-side variables

### Domain Not Working

- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Check SSL certificate status in hosting dashboard

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment
