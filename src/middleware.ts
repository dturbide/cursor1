import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Logging pour le débogage
  console.log('Middleware path:', req.nextUrl.pathname);
  console.log('Session exists:', !!session);

  // Routes publiques (accessibles uniquement si NON authentifié)
  if (['/auth/login', '/auth/register', '/auth/superadmin/login'].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return res;
  }

  // Rediriger vers login si pas de session pour toutes les routes protégées
  if (!session) {
    // Redirection spéciale pour les routes superadmin
    if (req.nextUrl.pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/auth/superadmin/login', req.url));
    }
    
    // Redirection standard pour les autres routes protégées
    if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Pour les routes superadmin, vérifier le rôle dans la table profiles
  if (session && req.nextUrl.pathname.startsWith('/superadmin')) {
    try {
      // Récupérer le rôle depuis la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      if (profileError || !profileData || profileData.role !== 'superadmin') {
        console.log('Accès non autorisé au superadmin pour:', session.user.email);
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|images/).*)'],
};
