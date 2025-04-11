import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { Negotiator } from 'negotiator';
import { match } from '@formatjs/intl-localematcher';

const publicPages = ['/', '/auth/login', '/auth/register'];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = match(languages, locales, defaultLocale)
  return locale
}

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  await supabase.auth.getSession()

  // Si la page est publique, on laisse passer
  if (publicPages.includes(request.nextUrl.pathname)) {
    return response;
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!request.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  if (request.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 