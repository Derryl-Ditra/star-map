import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/star-map' : '',
  images: {
    unoptimized: true,
  },
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
