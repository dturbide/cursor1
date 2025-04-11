import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'L\'identifiant de l\'utilisateur est requis' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Vérifier que l'utilisateur actuel est un superadmin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier le rôle de l'utilisateur actuel
    const { data: currentUserProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Accès refusé. Seuls les superadmins peuvent effectuer cette action.' },
        { status: 403 }
      );
    }

    // Mettre à jour le profil de l'utilisateur bloqué
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        is_blocked: false,
        blocked_at: null,
        block_reason: null
      })
      .eq('id', userId);

    if (error) {
      console.error('Erreur lors du déblocage de l\'utilisateur:', error);
      return NextResponse.json(
        { error: 'Erreur lors du déblocage de l\'utilisateur' },
        { status: 500 }
      );
    }

    // Ajouter un log de sécurité
    await supabase
      .from('security_logs')
      .insert({
        event_type: 'account_unlocked',
        user_id: userId,
        created_at: new Date().toISOString(),
        metadata: {
          unlocked_by: user.id,
          unlocked_by_email: user.email
        }
      });

    return NextResponse.json({ success: true, message: 'Utilisateur débloqué avec succès' });
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return NextResponse.json(
      { error: 'Une erreur inattendue est survenue' },
      { status: 500 }
    );
  }
} 