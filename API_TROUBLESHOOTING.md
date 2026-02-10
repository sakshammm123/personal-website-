# API Troubleshooting Guide

If APIs are not working on your deployed site, check these in order:

---

## 1. NEXTAUTH_URL must match your deployment URL

**Symptom:** Auth fails, redirects go to wrong URL, or APIs that use session fail.

**Fix:**
1. In Vercel → **personal-website-** → **Settings** → **Environment Variables**
2. Find **NEXTAUTH_URL**
3. Set it to your **exact** production URL, including `https://`:
   - Example: `https://personal-website-three-delta-3daxehpfd4.vercel.app`
   - Or your custom domain: `https://yourdomain.com`
4. **Save** and **Redeploy** (Settings → Deployments → Redeploy latest)

**Important:** No trailing slash. Must be `https://` in production.

---

## 2. Database migrations must be run

**Symptom:** APIs return 500, or errors like "table does not exist" / Prisma errors.

**Fix:** Run migrations against your **production** database.

In your terminal (use your real `DATABASE_URL` from Vercel):

```bash
cd /Users/sakshammahajan/Desktop/website

# Set DATABASE_URL to the same value as in Vercel (from Environment Variables)
export DATABASE_URL="postgres://YOUR_CONNECTION_STRING_HERE"

npx prisma migrate deploy
```

If you get a TLS error, try adding `?sslmode=no-verify` to the end of the URL **only for this local run** (don’t change it in Vercel).

After migrations succeed, redeploy or wait for the next deployment. APIs that use the database should work.

---

## 3. Environment variables in the correct project

**Symptom:** Build works but APIs fail at runtime (e.g. "DATABASE_URL is not set").

**Fix:**
1. In Vercel, open the **personal-website-** project (the one that is **Ready** and has the latest commit).
2. Go to **Settings** → **Environment Variables**.
3. Confirm these exist and are correct:
   - **DATABASE_URL** – PostgreSQL connection string
   - **NEXTAUTH_URL** – Your production URL (e.g. `https://personal-website-xxx.vercel.app`)
   - **NEXTAUTH_SECRET** – Set and not empty
   - **ADMIN_USERNAME** / **ADMIN_PASSWORD** – If you use admin APIs
   - **RESEND_API_KEY**, **GEMINI_API_KEY** – If you use contact form or chatbot
4. For each variable, ensure **Production** (and Preview if you use it) is selected.
5. **Redeploy** after changing env vars.

---

## 4. Create admin user (for admin APIs)

**Symptom:** Admin login or admin-only APIs return 401 or "Unauthorized".

**Fix:**
1. In Vercel → **Environment Variables** → set **ALLOW_ADMIN_SETUP** = `true` → Save.
2. Visit: `https://YOUR_VERCEL_URL/api/admin/setup` (e.g. `https://personal-website-three-delta-3daxehpfd4.vercel.app/api/admin/setup`).
3. Create the admin user (e.g. username `admin`, password = your **ADMIN_PASSWORD**).
4. Set **ALLOW_ADMIN_SETUP** back to `false` → Save.

---

## 5. Check API responses in the browser

1. Open your site: `https://YOUR_VERCEL_URL`
2. Open DevTools (F12) → **Network** tab.
3. Use the feature that calls the API (e.g. submit contact form, open admin, use chatbot).
4. Find the request to `/api/...` and check:
   - **Status:** 200 = OK, 4xx/5xx = error
   - **Response** body for error messages

Common statuses:
- **500** – Often database or server error (migrations, DATABASE_URL, or code bug).
- **401** – Auth/session issue (NEXTAUTH_URL, NEXTAUTH_SECRET, or no admin user).
- **404** – Wrong URL or deployment (confirm you’re on the right project URL).

---

## 6. Vercel function logs

1. In Vercel → **personal-website-** → **Deployments** → open the **latest** deployment.
2. Go to **Logs** or **Runtime Logs**.
3. Reproduce the API call and check for errors (e.g. Prisma, "table does not exist", "DATABASE_URL", "NEXTAUTH_URL").

---

## Quick checklist

- [ ] **NEXTAUTH_URL** = exact production URL (e.g. `https://personal-website-xxx.vercel.app`)
- [ ] **DATABASE_URL** set in Vercel (same as used for migrations)
- [ ] **npx prisma migrate deploy** run successfully against production DB
- [ ] **ALLOW_ADMIN_SETUP** used to create admin, then set back to `false`
- [ ] Redeployed after changing env vars
- [ ] Checked Network tab and Vercel logs for API errors

---

## Summary

Most “APIs not working” issues are due to:

1. **NEXTAUTH_URL** not matching the deployment URL → fix in Vercel, redeploy.
2. **Migrations not run** → run `npx prisma migrate deploy` with production **DATABASE_URL**.
3. **Wrong project or missing env vars** → confirm **personal-website-** and all required variables for Production.

After fixing, redeploy and test the APIs again.
