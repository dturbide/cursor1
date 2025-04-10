import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Déconnexion de Supabase
  await supabase.auth.signOut();
  
  // Créer une nouvelle réponse avec redirection
  const response = NextResponse.redirect('https://cursor1-one.vercel.app/');
  
  // Effacer explicitement les cookies de session
  response.cookies.delete('sb-access-token');
  response.cookies.delete('sb-refresh-token');
  
  return response;
} 