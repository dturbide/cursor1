/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ DANGEREUX: Ignorer les erreurs de compilation TypeScript durant la phase de build
    ignoreBuildErrors: true,
  },
  // Désactiver le prérendu statique
  output: 'standalone',
};

module.exports = nextConfig; 