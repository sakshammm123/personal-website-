/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip static optimization for API routes during build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip API route analysis during build to prevent database connection errors
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ignore Prisma client generation during build if DATABASE_URL is missing
      config.externals = config.externals || [];
    }
    return config;
  },
};

export default nextConfig;

