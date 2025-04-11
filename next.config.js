/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ DANGEREUX: Ignorer les erreurs de compilation TypeScript durant la phase de build
    ignoreBuildErrors: true,
  },
  // Configuration minimaliste
  swcMinify: true,
  reactStrictMode: true,
  // Configuration pour désactiver SSG
  env: {
    NEXT_PUBLIC_FORCE_DYNAMIC: "true"
  },
  // Page racine uniquement
  eslint: {
    ignoreDuringBuilds: true,
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
  // Bloquer le prérendu statique pour certaines pages
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
    };
  },
  // Ajouter des en-têtes de sécurité pour autoriser eval
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; img-src 'self' data:; font-src 'self' data:;"
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 