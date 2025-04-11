import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

const publicPages = ['/', '/auth/login', '/auth/register'];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Gestion de l'internationalisation
  const intlRes = await intlMiddleware(req);

  // Si la page est publique, on laisse passer
  if (publicPages.includes(req.nextUrl.pathname)) {
    return intlRes;
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return intlRes;
}

export const config = {
  matcher: ['/', '/(fr|en)/:path*', '/auth/:path*', '/dashboard/:path*', '/superadmin/:path*']
}; 