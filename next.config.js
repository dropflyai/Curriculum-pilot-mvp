/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack configuration for Pyodide
  webpack: (config, { isServer }) => {
    // Don't bundle Pyodide on the server side
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('pyodide')
    }

    // Ignore Pyodide's dynamic imports during build
    config.ignoreWarnings = [
      {
        module: /pyodide/,
        message: /Critical dependency: the request of a dependency is an expression/,
      },
    ]

    return config
  },
  
  // Enable experimental features if needed
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = nextConfig