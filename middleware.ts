import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // Liste des langues supportées
  locales: ['fr', 'en'],
  // Langue par défaut
  defaultLocale: 'fr',
  // Configuration locale
  localePrefix: 'as-needed'
});

export const config = {
  // Matcher pour les routes qui doivent être internationalisées
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 