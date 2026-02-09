# 🚀 Complete Deployment Guide - Step by Step

This guide will walk you through deploying your website from start to finish.

## 📋 Pre-Deployment Checklist

Before starting, ensure you have:
- [ ] Git repository initialized and code committed
- [ ] All environment variables documented
- [ ] Build passes locally (`npm run build`)
- [ ] Admin account credentials ready
- [ ] Domain name (optional, can add later)

---

## Step 1: Choose Your Hosting Platform

### Recommended: **Vercel** (Best for Next.js)
- ✅ Built by Next.js creators
- ✅ Free tier with generous limits
- ✅ Automatic deployments from Git
- ✅ Built-in SSL certificates
- ✅ Easy PostgreSQL integration

**Alternative Options:**
- **Railway** - Great for full-stack apps, easy PostgreSQL setup
- **Netlify** - Good free tier, but requires extra config for API routes
- **Render** - Simple deployment, good PostgreSQL support

**For this guide, we'll use Vercel (recommended).**

---

## Step 2: Prepare Your Code for Production

### 2.1 Verify Build Works
```bash
npm run build
```
✅ **Status:** Build successful! (Verified)

### 2.2 Commit Your Code to Git
```bash
# Check what files need to be committed
git status

# Add all files (except .env which should be ignored)
git add .

# Commit
git commit -m "Prepare for deployment"

# If you haven't pushed to GitHub yet:
# 1. Create a new repository on GitHub
# 2. Then run:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2.3 Ensure .env is in .gitignore
✅ **Status:** `.env` is already in `.gitignore` (Verified)

---

## Step 3: Set Up PostgreSQL Database

Your app currently uses SQLite. For production, you need PostgreSQL.

### Option A: Vercel Postgres (Easiest with Vercel)

1. **After deploying to Vercel:**
   - Go to your project dashboard
   - Click "Storage" → "Create Database" → "Postgres"
   - Vercel will automatically add `POSTGRES_URL` environment variable

### Option B: External PostgreSQL Providers (Use Before Deploying)

**Recommended Free Options:**
- **Neon** (https://neon.tech) - Free tier, serverless PostgreSQL
- **Supabase** (https://supabase.com) - Free tier, includes dashboard
- **Railway** (https://railway.app) - Free tier, easy setup

**Steps for Neon (Example):**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:password@host/dbname`)
4. Save this for Step 4

---

## Step 4: Update Prisma Schema for PostgreSQL

You need to change from SQLite to PostgreSQL:

```bash
# Edit prisma/schema.prisma
```

Change this:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

To this:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then regenerate Prisma client:
```bash
npx prisma generate
```

---

## Step 5: Prepare Environment Variables

Create a list of all environment variables you'll need in production:

### Required Variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth (CRITICAL - Generate new secret!)
NEXTAUTH_URL="https://yourdomain.com"  # Will be your production URL
NEXTAUTH_SECRET="generate-new-secret-here"  # Generate with: openssl rand -base64 32

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"

# Email (Resend)
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="onboarding@resend.dev"  # Or your verified domain email
ADMIN_EMAIL="saksham.manan@gmail.com"

# Chatbot (Optional but recommended)
GEMINI_API_KEY="your_gemini_api_key_here"

# Admin Setup Protection (Optional)
ALLOW_ADMIN_SETUP="false"
ADMIN_SETUP_TOKEN="generate-random-token-here"
```

### Generate Secrets:

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ADMIN_SETUP_TOKEN (optional)
openssl rand -hex 32
```

**⚠️ IMPORTANT:** 
- Use DIFFERENT secrets for production than development
- Never commit these to Git
- Keep them secure

---

## Step 6: Deploy to Vercel

### 6.1 Sign Up / Login
1. Go to https://vercel.com
2. Sign up or log in (you can use GitHub account)

### 6.2 Import Your Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. If you haven't connected GitHub, authorize Vercel to access your repos

### 6.3 Configure Project Settings

**Framework Preset:** Next.js (should auto-detect)

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

**Root Directory:** Leave as default (or set if your Next.js app is in a subdirectory)

### 6.4 Add Environment Variables

Before deploying, add all environment variables:

1. In the project setup page, scroll to "Environment Variables"
2. Add each variable from Step 5:
   - Click "Add Another"
   - Add variable name and value
   - Select environments: Production, Preview, Development

**Important:**
- For `NEXTAUTH_URL`, use your Vercel preview URL first: `https://your-project.vercel.app`
- You'll update this to your custom domain later

### 6.5 Set Up Database (Vercel Postgres)

1. In the project setup, click "Storage" → "Create Database"
2. Select "Postgres"
3. Choose a name for your database
4. Vercel will automatically add `POSTGRES_URL` environment variable
5. Update your `DATABASE_URL` to use `POSTGRES_URL`:
   - In environment variables, set: `DATABASE_URL=$POSTGRES_URL`

### 6.6 Deploy!

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

---

## Step 7: Run Database Migrations

After first deployment, you need to set up your database schema:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
npx prisma migrate deploy
```

### Option B: Using Vercel Dashboard

1. Go to your project → Settings → Build & Development Settings
2. Add a build command that includes migrations:
   ```
   npm run build && npx prisma migrate deploy
   ```
3. Redeploy

### Option C: Using Vercel's Database Tab

1. Go to your project → Storage → Your Database
2. Use the SQL editor to run migrations manually
3. Or use Prisma Studio: `npx prisma studio` (requires local connection)

---

## Step 8: Create Admin Account

After database is set up, create your admin account:

### Option A: Using Setup Script (If ALLOW_ADMIN_SETUP is enabled)

1. Visit: `https://your-project.vercel.app/api/admin/setup`
2. Use the setup form with your `ADMIN_SETUP_TOKEN`

### Option B: Using Vercel CLI Terminal

```bash
# Connect to Vercel environment
vercel env pull .env.production

# Run setup script (you may need to modify it to work remotely)
# Or use Prisma Studio to manually create admin user
```

### Option C: Using Prisma Studio Locally

1. Set `DATABASE_URL` in your local `.env` to your production database
2. Run: `npx prisma studio`
3. Manually create an Admin record with hashed password

**To hash password:**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
```

---

## Step 9: Set Up Custom Domain (Optional)

### 9.1 Purchase Domain
Buy from:
- Namecheap
- Google Domains
- Cloudflare Registrar
- GoDaddy

### 9.2 Configure Domain in Vercel

1. Go to your project → Settings → Domains
2. Add your domain (e.g., `sakshammahajan.com`)
3. Vercel will show DNS records to add

### 9.3 Configure DNS Records

**Option A: Use Vercel Nameservers (Easiest)**
1. Copy nameservers from Vercel
2. Go to your domain registrar
3. Update nameservers to Vercel's

**Option B: Use A/CNAME Records**
1. Add A record: `@` → Vercel IP (shown in dashboard)
2. Add CNAME: `www` → `cname.vercel-dns.com`

### 9.4 Update Environment Variables

After domain is verified:
1. Go to Project Settings → Environment Variables
2. Update `NEXTAUTH_URL` to: `https://yourdomain.com`
3. Redeploy

### 9.5 Wait for SSL
Vercel automatically provisions SSL certificates via Let's Encrypt. Wait 5-60 minutes.

---

## Step 10: Post-Deployment Verification

Test everything:

- [ ] **Homepage loads** - Visit your site
- [ ] **Blog posts display** - Check `/blog`
- [ ] **Admin login works** - Try `/admin/login`
- [ ] **Blog editor functions** - Create/edit a post
- [ ] **Image uploads work** - Upload an image
- [ ] **Contact form submits** - Test `/contact`
- [ ] **Chatbot works** - Test chatbot functionality
- [ ] **Analytics tracking** - Check admin dashboard

---

## Step 11: Set Up File Storage (Important!)

⚠️ **CRITICAL:** File uploads stored in `public/uploads/` are **ephemeral** on Vercel. They will be lost on redeployments!

### Recommended Solutions:

**Option A: Vercel Blob Storage (Easiest)**
1. In Vercel dashboard → Storage → Create → Blob
2. Install: `npm install @vercel/blob`
3. Update your upload code to use Vercel Blob

**Option B: Cloudinary (Popular)**
1. Sign up at https://cloudinary.com
2. Get API credentials
3. Install: `npm install cloudinary`
4. Update upload code

**Option C: AWS S3**
1. Create S3 bucket
2. Install: `npm install @aws-sdk/client-s3`
3. Configure and update upload code

**For now:** Your site will work, but uploaded images may be lost on redeployments. Plan to migrate to cloud storage soon.

---

## Step 12: Set Up Monitoring & Backups

### Monitoring:
- **Error Tracking:** Set up Sentry (free tier available)
- **Analytics:** Your site already has analytics built-in
- **Uptime:** Use UptimeRobot (free) to monitor site availability

### Backups:
- **Database:** Vercel Postgres includes automatic backups
- **Code:** Already backed up in Git
- **Files:** Set up automated backups for uploaded files

---

## Step 13: Security Checklist

- [ ] `NEXTAUTH_SECRET` is strong and unique
- [ ] `ADMIN_PASSWORD` is strong
- [ ] `ALLOW_ADMIN_SETUP` is set to `false` in production
- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env` file is in `.gitignore`
- [ ] SSL certificate is active (check browser padlock)
- [ ] Admin routes are protected (verify `/admin` requires auth)

---

## Troubleshooting

### Build Fails
- Check Node.js version matches (Vercel uses Node 18.x by default)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run lint`

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database is accessible (not blocked by firewall)
- Ensure migrations ran: `npx prisma migrate deploy`

### Environment Variables Not Working
- Restart deployment after adding variables
- Check variable names match exactly (case-sensitive)
- Verify `NEXT_PUBLIC_*` prefix for client-side variables

### Domain Not Working
- Wait for DNS propagation (up to 48 hours, usually < 1 hour)
- Verify DNS records are correct
- Check SSL certificate status in Vercel dashboard

### Admin Login Not Working
- Verify admin account exists in database
- Check `NEXTAUTH_URL` matches your domain exactly
- Verify `NEXTAUTH_SECRET` is set

---

## Quick Reference Commands

```bash
# Build locally
npm run build

# Test production build locally
npm start

# Generate Prisma client
npx prisma generate

# Run migrations (development)
npx prisma migrate dev

# Run migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Deploy to Vercel (CLI)
vercel

# Pull production environment variables
vercel env pull .env.production
```

---

## Next Steps After Deployment

1. ✅ Set up cloud file storage (Vercel Blob, Cloudinary, or S3)
2. ✅ Configure custom email domain in Resend
3. ✅ Set up error tracking (Sentry)
4. ✅ Configure automated backups
5. ✅ Set up monitoring alerts
6. ✅ Optimize images and performance
7. ✅ Set up CDN for static assets

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment
- **Vercel Support:** Available in dashboard

---

## Summary Checklist

- [ ] Code committed to Git
- [ ] Build passes locally
- [ ] Prisma schema updated to PostgreSQL
- [ ] Environment variables prepared
- [ ] Deployed to Vercel
- [ ] Database migrations run
- [ ] Admin account created
- [ ] Custom domain configured (optional)
- [ ] All features tested
- [ ] File storage configured
- [ ] Monitoring set up

**You're ready to go live! 🎉**
