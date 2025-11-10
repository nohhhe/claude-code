/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    transpilePackages: ['@monorepo/shared', '@monorepo/ui'],
  },
}

module.exports = nextConfig