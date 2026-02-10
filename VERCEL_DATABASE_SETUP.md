# 🗄️ Setting Up Database in Vercel - Step by Step

## Method 1: Vercel Postgres (Recommended)

### Step 1: Navigate to Storage

**Option A: From Project Dashboard**
1. Go to your Vercel project dashboard
2. Click **"Storage"** tab (top navigation bar)

**Option B: From Settings**
1. Go to your project → **Settings**
2. Look for **"Storage"** in the left sidebar
3. Click it

**Option C: Direct URL**
- Go to: `https://vercel.com/dashboard`
- Click your project
- Click **"Storage"** tab

---

### Step 2: Create Postgres Database

1. **Click:** "Create Database" button (or "+ New Database")
2. **Select:** "Postgres" from the list
3. **Name it:** `production-db` (or any name you like)
4. **Region:** Choose closest to you (optional)
5. **Click:** "Create" button
6. **Wait:** 1-2 minutes for database to be created

**What happens:**
- Vercel creates a PostgreSQL database
- Automatically adds `POSTGRES_URL` environment variable
- Shows connection details

---

### Step 3: Add DATABASE_URL Environment Variable

1. **Go to:** Settings → Environment Variables
2. **Click:** "Add New" button
3. **Fill in:**
   - **Name:** `DATABASE_URL`
   - **Value:** `$POSTGRES_URL` (this references the database)
   - **Environments:** 
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
4. **Click:** "Add"

**Why `$POSTGRES_URL`?**
- Vercel automatically creates `POSTGRES_URL` when you create the database
- Using `$POSTGRES_URL` references that variable
- This keeps your connection string secure

---

### Step 4: Verify Setup

1. **Check Environment Variables:**
   - Go to Settings → Environment Variables
   - You should see:
     - `POSTGRES_URL` (automatically added by Vercel)
     - `DATABASE_URL` (you just added) = `$POSTGRES_URL`

2. **Check Database:**
   - Go to Storage tab
   - You should see your database listed
   - Status should be "Active" or "Ready"

---

## Method 2: External Database (If Vercel Postgres Not Available)

If you don't see the Storage option, use an external provider:

### Option A: Neon (Free Tier)

1. **Sign up:** https://neon.tech
2. **Create project:**
   - Click "Create a project"
   - Name it: `saksham-website-production`
   - Select region
   - Click "Create project"
3. **Get connection string:**
   - After creation, you'll see a connection string
   - Copy it (looks like: `postgresql://user:pass@host/db`)
4. **Add to Vercel:**
   - Go to Settings → Environment Variables
   - Add `DATABASE_URL` = (paste the connection string)

### Option B: Supabase (Free Tier)

1. **Sign up:** https://supabase.com
2. **Create project:**
   - Click "New Project"
   - Name it: `saksham-website`
   - Set database password (save it!)
   - Click "Create new project"
3. **Get connection string:**
   - Go to Settings → Database
   - Find "Connection string" → "URI" tab
   - Copy it
   - Replace `[YOUR-PASSWORD]` with your password
4. **Add to Vercel:**
   - Go to Settings → Environment Variables
   - Add `DATABASE_URL` = (paste the connection string)

---

## Troubleshooting

### Can't Find Storage Tab?

**Possible reasons:**
1. **Free tier limitation:** Some free accounts may not have Storage
2. **Account type:** Check if you're on Hobby plan (should have Storage)
3. **UI update:** Vercel may have moved it

**Solutions:**
- Try refreshing the page
- Check if you're in the right project
- Use external database (Neon or Supabase) instead

### Database Creation Fails?

**Try:**
1. Refresh the page
2. Wait a few minutes and try again
3. Check Vercel status: https://status.vercel.com
4. Use external database as backup

### POSTGRES_URL Not Showing?

**Check:**
1. Did database creation complete? (check Storage tab)
2. Go to Environment Variables - it should be there automatically
3. If not, manually add:
   - Name: `POSTGRES_URL`
   - Value: (get from Storage → Database → Connection details)

---

## After Database Setup

Once database is set up:

1. ✅ **Update Build Command:**
   - Settings → Build & Development Settings
   - Build Command: `npx prisma generate && npm run build`

2. ✅ **Redeploy:**
   - Go to Deployments
   - Click "Redeploy"

3. ✅ **Run Migrations:**
   - After deployment succeeds, run:
   ```bash
   npx prisma migrate deploy
   ```

---

## Quick Checklist

- [ ] Found Storage tab in Vercel
- [ ] Created Postgres database
- [ ] Database shows as "Active" or "Ready"
- [ ] `POSTGRES_URL` appears in Environment Variables (automatic)
- [ ] Added `DATABASE_URL` = `$POSTGRES_URL` manually
- [ ] Updated build command to include `prisma generate`
- [ ] Ready to redeploy

---

## Need Help?

If you're stuck:
1. **Screenshot:** Share what you see in the Storage tab
2. **Error message:** Share any error messages
3. **Alternative:** We can set up external database (Neon/Supabase)

**Let me know what you see!** 🚀
