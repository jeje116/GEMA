import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
      },
      {
        source: '/:locale(en|id)/private-dining',
        destination: '/:locale/occasions',
        permanent: true,
      },
      {
        source: '/private-dining',
        destination: '/en/occasions',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
