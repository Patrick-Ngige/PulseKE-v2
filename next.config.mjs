/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization: enable Next.js Image component benefits
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'https',
        hostname: 'api.instagram.com',
      },
      {
        protocol: 'https',
        hostname: 'api.tiktok.com',
      },
      {
        protocol: 'https',
        hostname: 'youtube.googleapis.com',
      },
    ],
  },
  // Allow dev origin for network access (e.g., mobile device on same network)
  allowedDevOrigins: ['192.168.100.5'],
}

export default nextConfig
