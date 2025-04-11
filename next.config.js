/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ DANGEREUX: Ignorer les erreurs de compilation TypeScript durant la phase de build
    ignoreBuildErrors: true,
  },
  // Configuration pour la génération
  output: 'standalone',
  staticPageGenerationTimeout: 0,
  experimental: {
    // Désactiver les optimisations qui peuvent causer des problèmes
    workerThreads: false,
    cpus: 1,
    disableOptimizedLoading: true,
    disableStaticImages: true,
  },
  // Désactiver l'exportation statique pour la phase de build
  images: {
    unoptimized: true,
  },
  // Désactiver la compression pour faciliter le débogage
  compress: false,
};

module.exports = nextConfig; 