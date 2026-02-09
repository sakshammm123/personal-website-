# Saksham Mahajan - Personal Website

A professional personal website built with Next.js, TypeScript, and Tailwind CSS.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
- `NEXT_PUBLIC_CONTACT_EMAIL` - Your contact email
- `DATABASE_URL` - Database connection string (SQLite by default)
- `NEXTAUTH_SECRET` - Secret for authentication (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your site URL (http://localhost:3000 for dev)
- `GEMINI_API_KEY` - For chatbot functionality (optional)

### 3. Set Up Database
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Create Admin Account
```bash
node scripts/setup-admin.js admin your-password
```

### 5. Start Development Server
```bash
npm run dev
```

Visit:
- **Website:** http://localhost:3000
- **Blog:** http://localhost:3000/blog
- **Admin:** http://localhost:3000/admin/login

## Features

- **Personal Portfolio** - Showcase work, education, and interests
- **Blog System** - Full CMS with rich text editor, comments, and likes
- **Admin Panel** - Manage blog posts, view analytics
- **AI Chatbot** - Interactive chatbot for visitor engagement
- **Contact System** - Lead capture and contact forms

## Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - React components
- `/src/lib` - Utility functions and services
- `/src/data` - Site configuration data
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
