/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@cookshare/ui', '@cookshare/shared', '@cookshare/types'],
  experimental: {
    turbo: {
      resolveAlias: {
        '@/*': './src/*',
      },
    },
  },
  // Bind to all interfaces in development for Docker
  ...(process.env.NODE_ENV === 'development' && {
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  }),
}

module.exports = nextConfig