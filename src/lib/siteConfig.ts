export const siteConfig = {
  // Email must be configured via env. Do not hardcode.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  // Resume PDF is expected in /public. Configurable via env.
  resumePath: process.env.NEXT_PUBLIC_RESUME_PATH ?? "/resume.pdf",
  // Site URL for metadata (canonical URLs, Open Graph, etc.)
  // Defaults to localhost in development, must be set in production
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
} as const;

export function getContactEmail(): string | undefined {
  return siteConfig.email;
}

export function getSiteUrl(): string {
  return siteConfig.siteUrl;
}
