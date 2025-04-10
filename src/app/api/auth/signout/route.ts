import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Déconnexion de Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
    
    // Rediriger directement vers la page de connexion superadmin
    const response = NextResponse.redirect(new URL('/auth/superadmin/login', 'https://cursor1-one.vercel.app'));
    
    // Effacer explicitement les cookies de session
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // En cas d'erreur, rediriger quand même vers la page de connexion
    return NextResponse.redirect(new URL('/auth/superadmin/login', 'https://cursor1-one.vercel.app'));
  }
}

// Ajouter la méthode GET pour gérer les redirections
export async function GET() {
  return NextResponse.redirect(new URL('/auth/superadmin/login', 'https://cursor1-one.vercel.app'));
} 