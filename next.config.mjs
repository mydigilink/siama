/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.siama.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'siama.in',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;