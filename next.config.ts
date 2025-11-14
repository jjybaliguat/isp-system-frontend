import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // disable 'any' warnings
    'react-hooks/exhaustive-deps': 'off',       // disable hook dependency checks
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
