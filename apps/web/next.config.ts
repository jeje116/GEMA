import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const r2RemotePattern = (() => {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) return [];
  try {
    const parsed = new URL(publicUrl);
    return [
      {
        protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsed.hostname,
        port: parsed.port || undefined,
        pathname: `${parsed.pathname.replace(/\/$/, '')}/**`,
      },
    ];
  } catch {
    return [];
  }
})();

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
      ...r2RemotePattern,
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

export default withPayload(nextConfig);

