# ⚡ Quick Start Guide

Get your website running in 5 minutes!

## 🚀 Launch Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Environment (for chatbot)
Copy `.env.example` to `.env` and set `GEMINI_API_KEY` so the site chatbot works:
```bash
cp .env.example .env
# Edit .env and add your Gemini API key: GEMINI_API_KEY="your_key"
```
*Get a key at [Google AI Studio](https://aistudio.google.com/apikey).*

### 4. Create Admin Account
```bash
node scripts/setup-admin.js admin your-password
```
*(Replace `your-password` with a secure password)*

### 5. Start Server
```bash
npm run dev
```

### 6. Open in Browser
- **Website:** http://localhost:3000
- **Blog:** http://localhost:3000/blog
- **Admin Login:** http://localhost:3000/admin/login

## 📝 First Steps After Launch

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use the username and password you created

2. **Create Your First Post**
   - Click "New Post" in the dashboard
   - Fill in title, summary, topic, and content
   - Upload images using the 📷 button
   - Click "Save Post"

3. **View Your Blog**
   - Visit http://localhost:3000/blog
   - Your post should appear!

## 🔧 Troubleshooting

**"Module not found" errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Database not found" errors?**
```bash
npx prisma generate
npx prisma migrate dev
```

**Can't login?**
- Make sure you ran the setup-admin script
- Check that `.env` or `.env.local` has `NEXTAUTH_SECRET` set

**Chatbot not connecting?**
- Ensure the site is running: `npm run dev` (default: http://localhost:3000)
- Add `GEMINI_API_KEY` to `.env` (copy from `.env.example` and get a key from [Google AI Studio](https://aistudio.google.com/apikey))

## 📚 More Details

See `README.md` for complete documentation.

---

**That's it!** Your website is now running! 🎉
