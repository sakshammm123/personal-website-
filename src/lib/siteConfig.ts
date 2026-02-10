// In production on Vercel, VERCEL_URL is set automatically (e.g. "personal-website-xxx.vercel.app")
const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

export const siteConfig = {
  // Email must be configured via env. Do not hardcode.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  // Resume PDF is expected in /public. Configurable via env.
  resumePath: process.env.NEXT_PUBLIC_RESUME_PATH ?? "/resume.pdf",
  // Site URL for metadata (canonical URLs, Open Graph, etc.)
  // Uses NEXT_PUBLIC_SITE_URL, then NEXTAUTH_URL, then Vercel's VERCEL_URL, then localhost
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    vercelUrl ??
    "http://localhost:3000",
} as const;

export function getContactEmail(): string | undefined {
  return siteConfig.email;
}

export function getSiteUrl(): string {
  return siteConfig.siteUrl;
}
