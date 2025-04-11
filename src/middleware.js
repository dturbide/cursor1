import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone des en-têtes pour les modifier
  const response = NextResponse.next();
  
  // Ajouter des en-têtes CSP pour autoriser eval
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co; img-src 'self' data:; font-src 'self' data:;"
  );
  
  return response;
}

export const config = {
  // S'applique à toutes les routes
  matcher: ['/:path*'],
}; 