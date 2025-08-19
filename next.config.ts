import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix Jest worker issues
  experimental: {
    workerThreads: false,
  },
  // Optimize webpack for development stability
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce memory usage and worker conflicts
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxAsyncRequests: 6,
          maxInitialRequests: 4,
        },
      };
      // Reduce parallelism to prevent worker conflicts
      config.parallelism = 1;
    }
    return config;
  },
};

export default nextConfig;
