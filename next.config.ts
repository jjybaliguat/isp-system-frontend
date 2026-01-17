import type { NextConfig } from "next";

const remotePatterns: any[] = [
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
]

// If an API host is configured for uploads, allow its host too (useful for self-hosted uploads)
if (process.env.NEXT_PUBLIC_API_URL) {
  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL)
    remotePatterns.push({
      protocol: apiUrl.protocol.replace(':', ''),
      hostname: apiUrl.hostname,
      port: apiUrl.port || '',
      pathname: '/uploads/**',
    })
  } catch (e) {
    // ignore invalid URL
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
