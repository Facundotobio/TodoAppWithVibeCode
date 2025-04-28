/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@nextui-org/react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  }
};

module.exports = nextConfig; 