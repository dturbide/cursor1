import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

// Liste des pages publiques (sans le préfixe de locale)
const publicPages = ['/', '/auth/login', '/auth/register'];

// Créer le middleware d'internationalisation
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Gérer d'abord l'internationalisation
  const response = intlMiddleware(request);
  
  // Extraire la locale du chemin
  const pathnameWithoutLocale = pathname.replace(/^\/(?:fr|en)/, '');

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
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Si la page est publique, on laisse passer
  if (publicPages.includes(pathnameWithoutLocale)) {
    return response;
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!session && !pathnameWithoutLocale.startsWith('/auth')) {
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    const redirectUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (session && pathnameWithoutLocale.startsWith('/auth')) {
    const locale = request.nextUrl.pathname.split('/')[1] || defaultLocale;
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 