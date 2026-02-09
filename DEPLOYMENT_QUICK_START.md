# 🚀 Quick Start Deployment Guide

**TL;DR:** Deploy your Next.js website to Vercel in 15 minutes.

## Prerequisites Checklist

- [ ] Code is committed to Git
- [ ] GitHub account (free)
- [ ] Vercel account (free, sign up with GitHub)

---

## Step-by-Step Deployment

### 1️⃣ Push Code to GitHub (5 min)

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2️⃣ Sign Up for Vercel (2 min)

1. Go to https://vercel.com
2. Click "Sign Up" → Use GitHub
3. Authorize Vercel to access your repositories

### 3️⃣ Deploy to Vercel (5 min)

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel auto-detects Next.js settings ✅
4. **Don't deploy yet!** First set up environment variables (next step)

### 4️⃣ Set Up Database (5 min)

**Option A: Vercel Postgres (Easiest)**
1. In project setup, click **"Storage"** → **"Create Database"** → **"Postgres"**
2. Name it (e.g., "production-db")
3. Vercel adds `POSTGRES_URL` automatically

**Option B: External Provider (Neon - Free)**
1. Go to https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string (looks like: `postgresql://user:pass@host/db`)

### 5️⃣ Update Prisma Schema (2 min)

**Before deploying**, switch to PostgreSQL:

```bash
# Copy production schema
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Or manually edit prisma/schema.prisma:
# Change: provider = "sqlite"
# To:     provider = "postgresql"
```

Then commit:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

### 6️⃣ Configure Environment Variables (3 min)

In Vercel project setup, add these variables:

**Required:**
```env
# Database
DATABASE_URL=$POSTGRES_URL  # If using Vercel Postgres
# OR
DATABASE_URL=postgresql://...  # If using external provider

# NextAuth (Generate new secret!)
NEXTAUTH_URL=https://your-project.vercel.app  # Update after domain setup
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<your-secure-password>

# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
ADMIN_EMAIL=saksham.manan@gmail.com

# Chatbot (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 7️⃣ Deploy! (2 min)

1. Click **"Deploy"**
2. Wait 2-5 minutes
3. Your site is live at: `https://your-project.vercel.app` 🎉

### 8️⃣ Run Database Migrations (2 min)

After deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
npx prisma migrate deploy
```

### 9️⃣ Create Admin Account (2 min)

**Option A: Via Setup Endpoint**
1. Temporarily set `ALLOW_ADMIN_SETUP=true` in Vercel env vars
2. Visit: `https://your-project.vercel.app/api/admin/setup`
3. Create admin account
4. Set `ALLOW_ADMIN_SETUP=false` again

**Option B: Via Prisma Studio**
1. Set `DATABASE_URL` in local `.env` to production database
2. Run: `npx prisma studio`
3. Create Admin record manually

### 🔟 Test Everything (5 min)

Visit your site and test:
- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Admin login works (`/admin/login`)
- [ ] Contact form works
- [ ] Chatbot works (if enabled)

---

## 🎯 Custom Domain (Optional)

1. **Buy domain** (Namecheap, Google Domains, etc.)
2. **In Vercel:** Settings → Domains → Add domain
3. **Update DNS:** Follow Vercel's instructions
4. **Update NEXTAUTH_URL:** Change to your custom domain
5. **Redeploy**

---

## ⚠️ Important Notes

### File Uploads
⚠️ **Files uploaded to `public/uploads/` will be lost on redeployments!**

**Quick Fix:** Set up Vercel Blob Storage or Cloudinary (see DEPLOYMENT_CHECKLIST.md)

### Environment Variables
- Use **different secrets** for production vs development
- Never commit `.env` to Git
- Update `NEXTAUTH_URL` when you add a custom domain

### Database
- SQLite is fine for development
- **PostgreSQL is required** for production
- Migrations run automatically on Vercel (if configured)

---

## 🆘 Troubleshooting

**Build fails?**
- Check Node.js version (Vercel uses 18.x)
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

**Database errors?**
- Verify `DATABASE_URL` is correct
- Run migrations: `npx prisma migrate deploy`
- Check database is accessible

**Admin login doesn't work?**
- Verify admin account exists
- Check `NEXTAUTH_URL` matches your domain exactly
- Verify `NEXTAUTH_SECRET` is set

---

## 📚 More Help

- **Detailed Guide:** See `DEPLOYMENT_CHECKLIST.md`
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment

---

## ✅ Post-Deployment Checklist

- [ ] Site is live
- [ ] Database migrations ran
- [ ] Admin account created
- [ ] All features tested
- [ ] Custom domain configured (optional)
- [ ] File storage set up (Vercel Blob/Cloudinary)
- [ ] Monitoring configured

**You're live! 🎉**
