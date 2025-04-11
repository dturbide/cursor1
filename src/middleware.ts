import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// Liste des pages publiques (sans le préfixe de locale)
const publicPages = ['/auth/login', '/auth/register'];

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Handle i18n first
  let response = intlMiddleware(request);
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If we're on a secure connection, ensure the cookie is secure
          if (request.url.startsWith('https://')) {
            options.secure = true;
          }
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Get the session
  const { data: { session } } = await supabase.auth.getSession();

  // Get the locale from the pathname
  const locale = pathname.split('/')[1] || defaultLocale;
  const pathnameWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');

  // Allow public pages
  if (publicPages.some(page => pathnameWithoutLocale.startsWith(page))) {
    return response;
  }

  // Check authentication for protected routes
  if (!session && !pathnameWithoutLocale.startsWith('/auth')) {
    const redirectUrl = new URL(`/${locale}/auth/login`, request.url);
    redirectUrl.searchParams.set('redirectTo', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  if (session && pathnameWithoutLocale.startsWith('/auth')) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Handle superadmin routes
  if (pathnameWithoutLocale.startsWith('/superadmin')) {
    if (!session) {
      const redirectUrl = new URL(`/${locale}/auth/login`, request.url);
      redirectUrl.searchParams.set('redirectTo', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Check superadmin role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userProfile || userProfile.role !== 'superadmin') {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  return response;
}

// Configurer le matcher pour inclure toutes les routes nécessaires
export const config = {
  matcher: [
    // Routes protégées par l'authentification
    '/dashboard/:path*',
    '/settings/:path*',
    // Routes superadmin
    '/superadmin/:path*',
    '/:locale/superadmin/:path*',
    // Routes d'authentification
    '/auth/:path*',
    // Routes i18n
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
}; 