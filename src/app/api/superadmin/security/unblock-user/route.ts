import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient(cookieStore);

  try {
    const { userId } = await request.json();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // Vérifier le rôle superadmin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    // Débloquer l'utilisateur
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        is_blocked: false,
        blocked_at: null,
        block_reason: null
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Enregistrer l'action dans les logs de sécurité
    await supabase.rpc('create_security_log', {
      p_event_type: 'user_unblocked',
      p_user_id: userId,
      p_metadata: { unblocked_by: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du déblocage de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors du déblocage de l\'utilisateur' },
      { status: 500 }
    );
  }
} 