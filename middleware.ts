import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/settings';

// Créer le middleware d'internationalisation
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  // Gérer d'abord l'internationalisation
  const response = intlMiddleware(req);
  
  // Configurer le client Supabase
  const supabase = createMiddlewareClient({ req, res: response });

  // Ajouter des en-têtes CSP pour autoriser eval
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; img-src 'self' data:; font-src 'self' data:;"
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Logging pour le débogage
  console.log('Middleware path:', req.nextUrl.pathname);
  console.log('Session exists:', !!session);

  // Si l'utilisateur est connecté, récupérer son rôle
  let userRole = null;
  if (session) {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profileError && profileData) {
        userRole = profileData.role;
        console.log('User role:', userRole);
      } else {
        console.error('Error fetching user role:', profileError);
      }
    } catch (error) {
      console.error('Error in role check:', error);
    }
  }

  // Routes publiques (accessibles uniquement si NON authentifié)
  if (['/auth/login', '/auth/register'].includes(req.nextUrl.pathname)) {
    if (session) {
      // Rediriger vers le dashboard approprié selon le rôle
      if (userRole === 'superadmin') {
        return NextResponse.redirect(new URL('/superadmin/dashboard', req.url));
      }
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return response;
  }

  // Route de login superadmin
  if (req.nextUrl.pathname === '/auth/superadmin/login') {
    // Si l'utilisateur est déjà connecté et est un superadmin, rediriger vers le dashboard
    if (session && userRole === 'superadmin') {
      return NextResponse.redirect(new URL('/superadmin/dashboard', req.url));
    }
    // Sinon, permettre l'accès à la page de connexion
    return response;
  }

  // Rediriger vers login si pas de session pour toutes les routes protégées
  if (!session) {
    // Redirection spéciale pour les routes superadmin
    if (req.nextUrl.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/auth/superadmin/login', req.url));
    }
    
    // Redirection standard pour les autres routes protégées
    if (!req.nextUrl.pathname.startsWith('/_next') && 
        !req.nextUrl.pathname.startsWith('/api') && 
        !req.nextUrl.pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Protection des routes superadmin
  if (req.nextUrl.pathname.startsWith('/superadmin')) {
    if (userRole !== 'superadmin') {
      console.log('Tentative d\'accès non autorisé à une route superadmin');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Protection des routes dashboard standard
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!userRole) {
      console.log('Utilisateur sans rôle défini');
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)']
}; 