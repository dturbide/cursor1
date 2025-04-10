import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Déconnexion
  await supabase.auth.signOut();
  
  // Redirection vers la page de connexion
  return NextResponse.redirect(new URL('/auth/login', request.url));
} 