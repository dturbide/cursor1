import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Version 2.0.0 - Optimized for production
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true
};

export default withNextIntl(nextConfig); 