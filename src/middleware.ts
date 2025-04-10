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
    return res;
  }

  // Route de login superadmin
  if (req.nextUrl.pathname === '/auth/superadmin/login') {
    if (session) {
      if (userRole === 'superadmin') {
        return NextResponse.redirect(new URL('/superadmin/dashboard', req.url));
      }
      // Si connecté mais pas superadmin, rediriger vers le dashboard standard
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
    return NextResponse.redirect(new URL('/auth/login', req.url));
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

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|images/).*)'],
};
