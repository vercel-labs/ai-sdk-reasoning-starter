import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['geist'],
  images: {
    remotePatterns: [
      {
        hostname: 'vercel.com',
      },
    ],
  },
};

export default nextConfig;
