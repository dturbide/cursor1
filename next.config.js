/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ DANGEREUX: Ignorer les erreurs de compilation TypeScript durant la phase de build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 