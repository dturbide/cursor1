import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient(cookieStore);

  const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 401 });
  }

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  }

  // Vérifier si l'utilisateur est un superadmin
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profil utilisateur non trouvé' }, { status: 404 });
  }

  if (profile.role !== 'superadmin') {
    // Déconnecter l'utilisateur car il n'est pas superadmin
    await supabase.auth.signOut();
    return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
  }

  return NextResponse.redirect(new URL('/superadmin/dashboard', requestUrl.origin), {
    status: 301,
  });
} 