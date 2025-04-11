/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ DANGEREUX: Ignorer les erreurs de compilation TypeScript durant la phase de build
    ignoreBuildErrors: true,
  },
  // Désactiver le prérendu statique
  output: 'standalone',
  // Configuration supplémentaire pour désactiver le prérendu statique
  experimental: {
    workerThreads: false,
    cpus: 1
  },
};

module.exports = nextConfig; 