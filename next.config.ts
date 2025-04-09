import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  images: {
    remotePatterns: [{ hostname: 'cloudix.tarabezah.com' }],
  },
};

export default nextConfig;
