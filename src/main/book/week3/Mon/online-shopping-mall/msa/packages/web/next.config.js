/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@shopping-mall/shared', '@shopping-mall/ui'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000'
  }
}

module.exports = nextConfig