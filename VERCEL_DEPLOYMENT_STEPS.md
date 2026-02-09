# 🚀 Step-by-Step: Deploy to Vercel

Follow these exact steps to deploy your website.

---

## Step 1: Sign Up / Login to Vercel

1. **Go to:** https://vercel.com
2. **Click:** "Sign Up" (or "Log In" if you have an account)
3. **Choose:** "Continue with GitHub" (easiest since your code is on GitHub)
4. **Authorize:** Allow Vercel to access your GitHub repositories

---

## Step 2: Import Your Project

1. **After logging in**, you'll see the Vercel dashboard
2. **Click:** "Add New..." button (top right)
3. **Select:** "Project"
4. **Find your repository:** Look for `sakshammm123/personal-website-`
5. **Click:** "Import" next to your repository

---

## Step 3: Configure Project Settings

Vercel will auto-detect Next.js! Verify these settings:

### Framework Preset:
- ✅ Should show: **Next.js** (auto-detected)

### Build Settings:
- **Build Command:** `npm run build` (default - keep this)
- **Output Directory:** `.next` (default - keep this)
- **Install Command:** `npm install` (default - keep this)
- **Root Directory:** `./` (default - keep this)

### Node.js Version:
- **Version:** 18.x (default - this is fine)

**✅ Don't click "Deploy" yet!** We need to add environment variables first.

---

## Step 4: Set Up Database (Vercel Postgres)

**Before adding environment variables**, let's set up the database:

1. **In the project setup page**, scroll down to find **"Storage"** section
2. **Click:** "Create Database"
3. **Select:** "Postgres"
4. **Name it:** `production-db` (or any name you like)
5. **Click:** "Create"
6. **Wait:** 1-2 minutes for database to be created
7. **Vercel will automatically add:** `POSTGRES_URL` environment variable

---

## Step 5: Add Environment Variables

**Scroll to "Environment Variables" section** and add these one by one:

### Required Variables:

1. **DATABASE_URL**
   - **Value:** `$POSTGRES_URL` (this references the Postgres database you just created)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

2. **NEXTAUTH_URL**
   - **Value:** `https://your-project.vercel.app` (we'll update this after deployment)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **Note:** Replace `your-project` with your actual project name

3. **NEXTAUTH_SECRET**
   - **Value:** `CFze5wq3CldYgcsKG/9l7CnInjbYSZHzj3YBsW0lNn0=`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

4. **ADMIN_USERNAME**
   - **Value:** `admin`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

5. **ADMIN_PASSWORD**
   - **Value:** `[Choose a strong password - at least 12 characters]`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
   - **⚠️ Important:** Use a strong password! Save it securely.

6. **RESEND_API_KEY**
   - **Value:** `re_YWEpxuPz_3FbPnKxCW5xPgeL8pnbAoK11`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

7. **RESEND_FROM_EMAIL**
   - **Value:** `onboarding@resend.dev`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

8. **ADMIN_EMAIL**
   - **Value:** `saksham.manan@gmail.com`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

9. **GEMINI_API_KEY**
   - **Value:** `AIzaSyBssqLg1BEXxLKlTVmgpv2RwhEPUyswTZQ`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

10. **ALLOW_ADMIN_SETUP**
    - **Value:** `false`
    - **Environments:** ✅ Production, ✅ Preview, ✅ Development

### How to Add Each Variable:

1. **Click:** "Add Another" button
2. **Enter:** Variable name (e.g., `NEXTAUTH_SECRET`)
3. **Enter:** Variable value (e.g., `CFze5wq3CldYgcsKG/9l7CnInjbYSZHzj3YBsW0lNn0=`)
4. **Select:** Environments (Production, Preview, Development)
5. **Click:** "Add"
6. **Repeat** for each variable above

---

## Step 6: Deploy!

1. **After adding all environment variables**, scroll to the bottom
2. **Click:** "Deploy" button
3. **Wait:** 2-5 minutes for deployment to complete
4. **Watch:** The build logs in real-time

**✅ Your site will be live at:** `https://your-project.vercel.app`

---

## Step 7: Update NEXTAUTH_URL

**After deployment completes:**

1. **Copy your Vercel URL** (e.g., `https://your-project.vercel.app`)
2. **Go to:** Project Settings → Environment Variables
3. **Find:** `NEXTAUTH_URL`
4. **Click:** Edit (pencil icon)
5. **Update value** to your Vercel URL
6. **Save**
7. **Redeploy** (or it will auto-redeploy)

---

## Step 8: Connect Your Custom Domain

Since you have a domain, let's connect it:

1. **Go to:** Your project → Settings → Domains
2. **Click:** "Add Domain"
3. **Enter:** Your domain (e.g., `sakshammahajan.com`)
4. **Click:** "Add"

### Configure DNS:

Vercel will show you DNS records to add. You have two options:

#### Option A: Use Vercel Nameservers (Easiest)

1. **Copy the nameservers** from Vercel (looks like: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
2. **Go to your domain registrar** (where you bought the domain)
3. **Find DNS/Nameserver settings**
4. **Replace existing nameservers** with Vercel's nameservers
5. **Save**

#### Option B: Use DNS Records (More Control)

1. **In Vercel**, you'll see DNS records to add:
   - **A Record:** `@` → Vercel IP address
   - **CNAME:** `www` → `cname.vercel-dns.com`
2. **Go to your domain registrar's DNS settings**
3. **Add these records**
4. **Save**

### Wait for DNS Propagation:

- **Usually:** 5-60 minutes
- **Maximum:** Up to 48 hours (rare)
- **Check status:** Vercel dashboard will show when domain is connected

### Update NEXTAUTH_URL Again:

1. **After domain is connected**, go to Environment Variables
2. **Update:** `NEXTAUTH_URL` to `https://yourdomain.com`
3. **Redeploy**

---

## Step 9: Run Database Migrations

**After deployment**, set up your database schema:

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Link project:**
   ```bash
   cd /Users/sakshammahajan/Desktop/website
   vercel link
   ```
   - Select your project when prompted

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Using Vercel Dashboard

1. **Go to:** Project Settings → Build & Development Settings
2. **Add build command:**
   ```
   npm run build && npx prisma migrate deploy
   ```
3. **Save**
4. **Redeploy**

---

## Step 10: Create Admin Account

**After migrations are complete**, create your admin account:

### Option A: Via Setup Endpoint (Easiest)

1. **Temporarily enable setup:**
   - Go to Environment Variables
   - Find `ALLOW_ADMIN_SETUP`
   - Change to `true`
   - Save

2. **Visit:** `https://your-domain.com/api/admin/setup`
   - Or: `https://your-project.vercel.app/api/admin/setup`

3. **Create admin account:**
   - Enter username: `admin`
   - Enter password: (use the `ADMIN_PASSWORD` you set)
   - Click "Create"

4. **Disable setup:**
   - Change `ALLOW_ADMIN_SETUP` back to `false`
   - Save

### Option B: Via Prisma Studio

1. **Set DATABASE_URL locally:**
   - Copy `POSTGRES_URL` from Vercel environment variables
   - Add to your local `.env` file as `DATABASE_URL`

2. **Run Prisma Studio:**
   ```bash
   npx prisma studio
   ```

3. **Create Admin record:**
   - Click "Add record"
   - Username: `admin`
   - Password: (hash it first - see below)

4. **Hash password:**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
   ```

---

## Step 11: Test Everything

Visit your site and test:

- [ ] **Homepage loads** - Visit your domain
- [ ] **Blog posts display** - Check `/blog`
- [ ] **Admin login works** - Try `/admin/login`
- [ ] **Blog editor functions** - Create/edit a post
- [ ] **Contact form submits** - Test `/contact`
- [ ] **Chatbot works** - Test chatbot functionality
- [ ] **Analytics tracking** - Check admin dashboard

---

## 🎉 You're Live!

Your website is now deployed and accessible at your domain!

---

## Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Check Node.js version (should be 18.x)

### Database Connection Errors?
- Verify `DATABASE_URL` is set correctly
- Check migrations ran: `npx prisma migrate deploy`
- Verify database is accessible

### Domain Not Working?
- Wait for DNS propagation (5-60 minutes)
- Verify DNS records are correct
- Check SSL certificate status in Vercel

### Admin Login Doesn't Work?
- Verify admin account exists
- Check `NEXTAUTH_URL` matches your domain exactly
- Verify `NEXTAUTH_SECRET` is set

---

**Ready to start?** Let me know when you've signed up to Vercel and we'll continue! 🚀
