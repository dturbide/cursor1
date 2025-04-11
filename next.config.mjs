/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['next-intl']
  }
};

export default nextConfig; 