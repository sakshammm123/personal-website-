# Resend Email Setup Guide

This guide will help you set up Resend to receive email notifications for contact form submissions and leads.

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Click **"Sign Up"** (top right)
3. Sign up with your email address (it's free!)

## Step 2: Get Your API Key

1. After signing up, you'll be taken to the Resend dashboard
2. Click on **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g., "Website Notifications")
5. Select **"Sending access"** permissions
6. Click **"Add"**
7. **Copy the API key** - you'll need it in the next step!
   - ⚠️ **Important**: You can only see this key once. Copy it now!

## Step 3: Verify Your Domain (Optional for Production)

For testing, you can skip this step and use `onboarding@resend.dev` as your sender email.

For production:
1. Go to **"Domains"** in the Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `sakshammahajan.com`)
4. Follow the DNS setup instructions to verify your domain
5. Once verified, you can use emails like `noreply@sakshammahajan.com`

## Step 4: Install the Resend Package

Run this command in your project directory:

```bash
npm install resend
```

## Step 5: Configure Environment Variables

1. Open your `.env` file (create it if it doesn't exist)
2. Add these variables:

```env
# Resend API Key (from Step 2)
RESEND_API_KEY="re_your_api_key_here"

# Email to send FROM (use onboarding@resend.dev for testing)
RESEND_FROM_EMAIL="onboarding@resend.dev"

# Your email address (where you want to receive notifications)
ADMIN_EMAIL="your-email@example.com"
```

**Example:**
```env
RESEND_API_KEY="re_AbCdEfGh123456789"
RESEND_FROM_EMAIL="onboarding@resend.dev"
ADMIN_EMAIL="saksham@example.com"
```

## Step 6: Test It!

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Submit a test contact form on your website

3. Check your email inbox (the one you set in `ADMIN_EMAIL`)

4. You should receive an email notification!

## Troubleshooting

### Not receiving emails?

1. **Check your `.env` file** - Make sure all variables are set correctly
2. **Check the server logs** - Look for any error messages
3. **Verify your API key** - Make sure you copied it correctly (starts with `re_`)
4. **Check spam folder** - Emails might go to spam initially
5. **Verify Resend dashboard** - Check the "Emails" section to see if emails were sent

### "Invalid API key" error?

- Make sure your `RESEND_API_KEY` starts with `re_`
- Check that there are no extra spaces or quotes in your `.env` file
- Regenerate your API key in Resend if needed

### "Domain not verified" error?

- For testing, use `onboarding@resend.dev` as your `RESEND_FROM_EMAIL`
- For production, verify your domain in Resend first

## Free Tier Limits

- **3,000 emails per month** (free)
- Perfect for contact form notifications!
- Upgrade if you need more

## Need Help?

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
