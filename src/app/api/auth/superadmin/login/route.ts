import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Tentative de connexion
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    if (!signInData.user) {
      return NextResponse.json({ error: 'Aucun utilisateur retourné' }, { status: 400 });
    }

    // Vérification du rôle
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Erreur lors de la vérification du rôle' }, { status: 400 });
    }

    if (!profileData || profileData.role !== 'superadmin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
} 