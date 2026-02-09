# 🚀 Step-by-Step Deployment Guide

Follow these steps **in order** to deploy your website.

---

## ✅ What's Already Done

- ✅ Code committed to Git
- ✅ Code pushed to GitHub (https://github.com/sakshammm123/personal-website-)
- ✅ Prisma schema switched to PostgreSQL
- ✅ Production secrets generated

---

## 📋 Step 1: Sign Up for Vercel

**Time: 2 minutes**

1. **Go to:** https://vercel.com
2. **Click:** "Sign Up" (top right)
3. **Choose:** "Continue with GitHub"
4. **Authorize:** Click "Authorize Vercel" to allow access to your GitHub
5. **Complete:** Any additional setup steps

**✅ Done when:** You see the Vercel dashboard

---

## 📋 Step 2: Import Your Project

**Time: 1 minute**

1. **In Vercel dashboard**, click **"Add New..."** button (top right)
2. **Select:** "Project"
3. **You'll see:** A list of your GitHub repositories
4. **Find:** `sakshammm123/personal-website-`
5. **Click:** "Import" button next to it

**✅ Done when:** You see the project configuration page

---

## 📋 Step 3: Configure Project Settings

**Time: 1 minute**

Vercel auto-detects Next.js! Just verify:

- **Framework Preset:** Should show "Next.js" ✅
- **Root Directory:** `./` (default - keep this)
- **Build Command:** `npm run build` (default - keep this)
- **Output Directory:** `.next` (default - keep this)
- **Install Command:** `npm install` (default - keep this)

**✅ Don't click "Deploy" yet!** We need to set up database first.

---

## 📋 Step 4: Set Up Database (Vercel Postgres)

**Time: 2 minutes**

1. **On the project setup page**, scroll down to find **"Storage"** section
2. **Click:** "Create Database" button
3. **Select:** "Postgres" from the list
4. **Name it:** `production-db` (or any name you like)
5. **Click:** "Create" button
6. **Wait:** 1-2 minutes for database to be created
7. **You'll see:** `POSTGRES_URL` automatically added to environment variables

**✅ Done when:** Database is created and `POSTGRES_URL` appears in environment variables

---

## 📋 Step 5: Add Environment Variables

**Time: 5 minutes**

**Scroll to "Environment Variables" section** and add these **one by one**:

### Variable 1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `$POSTGRES_URL` (this references the database you just created)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 2: NEXTAUTH_URL
- **Name:** `NEXTAUTH_URL`
- **Value:** `https://your-project.vercel.app` (we'll update this after deployment)
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"
- **Note:** Replace `your-project` with your actual project name (Vercel will show it)

### Variable 3: NEXTAUTH_SECRET
- **Name:** `NEXTAUTH_SECRET`
- **Value:** `CFze5wq3CldYgcsKG/9l7CnInjbYSZHzj3YBsW0lNn0=`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 4: ADMIN_USERNAME
- **Name:** `ADMIN_USERNAME`
- **Value:** `admin`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 5: ADMIN_PASSWORD
- **Name:** `ADMIN_PASSWORD`
- **Value:** `[Choose a strong password - at least 12 characters]`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"
- **⚠️ Important:** Use a strong password! Save it securely. You'll need it to log in.

### Variable 6: RESEND_API_KEY
- **Name:** `RESEND_API_KEY`
- **Value:** `re_YWEpxuPz_3FbPnKxCW5xPgeL8pnbAoK11`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 7: RESEND_FROM_EMAIL
- **Name:** `RESEND_FROM_EMAIL`
- **Value:** `onboarding@resend.dev`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 8: ADMIN_EMAIL
- **Name:** `ADMIN_EMAIL`
- **Value:** `saksham.manan@gmail.com`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 9: GEMINI_API_KEY
- **Name:** `GEMINI_API_KEY`
- **Value:** `AIzaSyBssqLg1BEXxLKlTVmgpv2RwhEPUyswTZQ`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

### Variable 10: ALLOW_ADMIN_SETUP
- **Name:** `ALLOW_ADMIN_SETUP`
- **Value:** `false`
- **Environments:** ✅ Production ✅ Preview ✅ Development
- **Click:** "Add"

**✅ Done when:** All 10 variables are added

---

## 📋 Step 6: Deploy!

**Time: 3-5 minutes**

1. **Scroll to bottom** of the page
2. **Click:** "Deploy" button (big blue button)
3. **Watch:** The build logs appear in real-time
4. **Wait:** 2-5 minutes for deployment to complete

**What happens:**
- Vercel builds your Next.js app
- Runs `npm install`
- Runs `npm run build`
- Deploys to their servers

**✅ Done when:** You see "Congratulations! Your project has been deployed"
**Your site URL:** `https://your-project.vercel.app` (shown on screen)

---

## 📋 Step 7: Update NEXTAUTH_URL

**Time: 2 minutes**

1. **Copy your Vercel URL** from the deployment page (e.g., `https://your-project.vercel.app`)
2. **Go to:** Your project → Settings → Environment Variables
3. **Find:** `NEXTAUTH_URL` in the list
4. **Click:** Edit icon (pencil) next to it
5. **Update value** to your Vercel URL (e.g., `https://your-project.vercel.app`)
6. **Click:** "Save"
7. **Vercel will auto-redeploy** (or click "Redeploy" button)

**✅ Done when:** NEXTAUTH_URL matches your Vercel URL

---

## 📋 Step 8: Connect Your Custom Domain

**Time: 5-10 minutes**

1. **Go to:** Your project → Settings → Domains
2. **Click:** "Add Domain" button
3. **Enter:** Your domain name (e.g., `sakshammahajan.com`)
4. **Click:** "Add"

### Configure DNS:

Vercel will show you DNS records. Choose one method:

#### Method A: Use Vercel Nameservers (Easiest) ⭐

1. **Copy nameservers** from Vercel (looks like: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
2. **Go to your domain registrar** (where you bought the domain)
3. **Find:** DNS/Nameserver settings
4. **Replace** existing nameservers with Vercel's nameservers
5. **Save**

#### Method B: Use DNS Records

1. **In Vercel**, copy the DNS records shown:
   - **A Record:** `@` → Vercel IP address
   - **CNAME:** `www` → `cname.vercel-dns.com`
2. **Go to your domain registrar's DNS settings**
3. **Add these records**
4. **Save**

### Wait for DNS:

- **Usually:** 5-60 minutes
- **Maximum:** Up to 48 hours (rare)
- **Check:** Vercel dashboard shows when domain is connected

### Update NEXTAUTH_URL Again:

1. **After domain is connected**, go to Environment Variables
2. **Update:** `NEXTAUTH_URL` to `https://yourdomain.com`
3. **Save** (will auto-redeploy)

**✅ Done when:** Domain shows as "Valid" in Vercel dashboard

---

## 📋 Step 9: Run Database Migrations

**Time: 3 minutes**

**After deployment**, set up your database schema:

### Using Vercel CLI:

1. **Open terminal** on your computer
2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Login:**
   ```bash
   vercel login
   ```
   - Follow prompts to login

4. **Navigate to project:**
   ```bash
   cd /Users/sakshammahajan/Desktop/website
   ```

5. **Link project:**
   ```bash
   vercel link
   ```
   - Select your project when prompted
   - Select "Use existing project"
   - Choose your project name

6. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

**✅ Done when:** Migrations complete successfully

---

## 📋 Step 10: Create Admin Account

**Time: 2 minutes**

### Method 1: Via Setup Endpoint (Easiest)

1. **Enable setup temporarily:**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Find `ALLOW_ADMIN_SETUP`
   - Click Edit
   - Change value to `true`
   - Save

2. **Visit setup page:**
   - Go to: `https://your-domain.com/api/admin/setup`
   - Or: `https://your-project.vercel.app/api/admin/setup`

3. **Create account:**
   - Username: `admin`
   - Password: (use the `ADMIN_PASSWORD` you set in Step 5)
   - Click "Create Admin Account"

4. **Disable setup:**
   - Go back to Environment Variables
   - Change `ALLOW_ADMIN_SETUP` back to `false`
   - Save

**✅ Done when:** You can log in at `/admin/login`

---

## 📋 Step 11: Test Everything

**Time: 5 minutes**

Visit your site and test:

- [ ] **Homepage loads** - Visit your domain
- [ ] **Blog posts display** - Check `/blog` (if you have posts)
- [ ] **Admin login works** - Go to `/admin/login` and log in
- [ ] **Contact form submits** - Test `/contact`
- [ ] **Chatbot works** - Test chatbot functionality
- [ ] **Analytics tracking** - Check admin dashboard

**✅ Done when:** Everything works!

---

## 🎉 You're Live!

Your website is now deployed and accessible!

**Your site:** `https://your-domain.com` (or `.vercel.app` URL)

---

## 📝 Quick Reference

### Your Environment Variables:
- `DATABASE_URL` = `$POSTGRES_URL`
- `NEXTAUTH_URL` = `https://your-domain.com`
- `NEXTAUTH_SECRET` = `CFze5wq3CldYgcsKG/9l7CnInjbYSZHzj3YBsW0lNn0=`
- `ADMIN_USERNAME` = `admin`
- `ADMIN_PASSWORD` = (your chosen password)
- `RESEND_API_KEY` = `re_YWEpxuPz_3FbPnKxCW5xPgeL8pnbAoK11`
- `RESEND_FROM_EMAIL` = `onboarding@resend.dev`
- `ADMIN_EMAIL` = `saksham.manan@gmail.com`
- `GEMINI_API_KEY` = `AIzaSyBssqLg1BEXxLKlTVmgpv2RwhEPUyswTZQ`
- `ALLOW_ADMIN_SETUP` = `false`

---

## 🆘 Need Help?

If you get stuck at any step, let me know which step and I'll help!

**Ready to start?** Begin with Step 1! 🚀
