import type { NextConfig } from "next";

// Import migration redirects
const migrationRedirects = require('./scripts/redirects.js');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    const dynamicMap = await migrationRedirects();
    return [
      ...dynamicMap,
      // Additional static redirects
      { source: '/contact', destination: '/', permanent: true },
      { source: '/about', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
