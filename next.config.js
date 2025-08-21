/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration for Pyodide and TensorFlow.js
  webpack: (config, { isServer }) => {
    // Don't bundle these on the server side
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('pyodide', '@tensorflow/tfjs', '@tensorflow/tfjs-node')
    }

    // Handle TensorFlow.js module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }

    // Ignore dynamic import warnings
    config.ignoreWarnings = [
      {
        module: /pyodide/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
      {
        module: /@tensorflow/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ]

    // Add rule for handling TensorFlow.js files
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/@tensorflow/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          cacheDirectory: true,
        },
      },
    })

    return config
  },
  
  // Enable experimental features if needed
  experimental: {
    esmExternals: 'loose',
  },
  
  // ESLint configuration for production builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if ESLint errors
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig