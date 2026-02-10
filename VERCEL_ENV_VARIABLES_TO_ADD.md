# Add These Environment Variables in Vercel

**Project:** Open **personal-website-** (the one with the working deployment)  
**Where:** Settings → Environment Variables → Add New  

**For each variable:**  
- Add the **Key** (name) and **Value** below  
- Select **Production**, **Preview**, and **Development**  
- Click **Add**  

Use your **real** values where noted (e.g. your Vercel URL, your password).

---

## 1. DATABASE_URL

- **Key:** `DATABASE_URL`
- **Value:**  
  `postgres://f59975744ec2d0c118eb8d2631d3cba4417a3d98b8a990be04731e6985408609:sk_KvJ40JfLAVeKYHiguPOVh@db.prisma.io:5432/postgres?sslmode=require`

---

## 2. NEXTAUTH_URL

- **Key:** `NEXTAUTH_URL`
- **Value:** Your **exact** live site URL only. Example (use your own if different):  
  `https://personal-website-three-delta-3daxehpfd4.vercel.app`  
  **Do not include any extra text** – only the URL, no spaces, no trailing slash.

---

## 3. NEXTAUTH_SECRET

- **Key:** `NEXTAUTH_SECRET`
- **Value:** `CFze5wq3CldYgcsKG/9l7CnInjbYSZHzj3YBsW0lNn0=`

---

## 4. ADMIN_USERNAME

- **Key:** `ADMIN_USERNAME`
- **Value:** `admin`

---

## 5. ADMIN_PASSWORD

- **Key:** `ADMIN_PASSWORD`
- **Value:** Choose a strong password and type it here (e.g. a long random password). Save it somewhere safe; you’ll use it to log in to `/admin/login`.

---

## 6. RESEND_API_KEY

- **Key:** `RESEND_API_KEY`
- **Value:** `re_YWEpxuPz_3FbPnKxCW5xPgeL8pnbAoK11`

---

## 7. RESEND_FROM_EMAIL

- **Key:** `RESEND_FROM_EMAIL`
- **Value:** `onboarding@resend.dev`

---

## 8. ADMIN_EMAIL

- **Key:** `ADMIN_EMAIL`
- **Value:** `saksham.manan@gmail.com`

---

## 9. GEMINI_API_KEY

- **Key:** `GEMINI_API_KEY`
- **Value:** `AIzaSyBssqLg1BEXxLKlTVmgpv2RwhEPUyswTZQ`

---

## 10. ALLOW_ADMIN_SETUP

- **Key:** `ALLOW_ADMIN_SETUP`
- **Value:** `false`  
  (Set to `true` only when you want to create the admin user via `/api/admin/setup`, then set back to `false`.)

---

## Checklist

- [ ] Opened **personal-website-** (not personal-websitesm or sakshampersonal-website)
- [ ] Settings → Environment Variables
- [ ] Added all 10 variables above
- [ ] For each variable: Production, Preview, Development selected
- [ ] NEXTAUTH_URL = your real Vercel URL (e.g. https://personal-website-three-delta-3daxehpfd4.vercel.app)
- [ ] ADMIN_PASSWORD = a strong password you saved
- [ ] Clicked **Save** / **Add** for each
- [ ] Redeployed (Deployments → latest → Redeploy)

After adding them, **Redeploy** the latest deployment so the new env vars are used.
