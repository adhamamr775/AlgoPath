import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://algopath_backend:5000/api/:path*', // Proxy to Backend
      },
    ]
  },
};

export default nextConfig;
