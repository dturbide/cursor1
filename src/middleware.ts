import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Vérifier la session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // URLs qui ne nécessitent pas d'authentification
  const publicUrls = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/pricing',
  ]

  const isPublicUrl = publicUrls.some(url => req.nextUrl.pathname === url)

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && !isPublicUrl) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth
  if (session && (req.nextUrl.pathname.startsWith('/auth/'))) {
    // Vérifier le rôle de l'utilisateur pour la redirection
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const redirectUrl = profile?.role === 'superadmin' 
      ? '/dashboard/superadmin'
      : '/dashboard/company'

    return NextResponse.redirect(new URL(redirectUrl, req.url))
  }

  // Vérification des accès aux dashboards selon le rôle
  if (session && req.nextUrl.pathname.startsWith('/dashboard/')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const isSuperadminRoute = req.nextUrl.pathname.startsWith('/dashboard/superadmin')
    const isCompanyRoute = req.nextUrl.pathname.startsWith('/dashboard/company')

    if (isSuperadminRoute && profile?.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard/company', req.url))
    }

    if (isCompanyRoute && profile?.role === 'superadmin') {
      return NextResponse.redirect(new URL('/dashboard/superadmin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
