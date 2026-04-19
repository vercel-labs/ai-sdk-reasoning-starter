import type { NextConfig } from 'next';
import { withBotId } from 'botid/next/config';

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

export default withBotId(nextConfig);
