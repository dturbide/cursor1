/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['next-intl']
  },
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: true
  }
};

export default nextConfig; 