import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Déconnexion de Supabase
    await supabase.auth.signOut();
    
    // Créer une nouvelle réponse avec redirection vers la page de connexion superadmin
    const response = NextResponse.redirect('https://cursor1-one.vercel.app/auth/superadmin/login');
    
    // Effacer explicitement les cookies de session
    response.cookies.delete('sb-access-token');
    response.cookies.delete('sb-refresh-token');
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return NextResponse.json({ error: 'Erreur lors de la déconnexion' }, { status: 500 });
  }
} 