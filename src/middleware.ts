import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Routes protégées (nécessitent une authentification)
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Routes publiques (accessibles uniquement si NON authentifié)
  if (['/auth/login', '/auth/register'].includes(req.nextUrl.pathname)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Rediriger à la page login si pas de session
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Pour les routes admin, vérifier le rôle superadmin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: userData } = await supabase.auth.getUser();
    const userRole = userData.user?.user_metadata?.role;
    
    if (userRole !== 'superadmin') {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
