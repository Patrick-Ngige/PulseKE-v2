/** @type {import('next').NextConfig} */
const nextConfig = {
  // No force-static — this app is fully dynamic
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
};

module.exports = nextConfig;
