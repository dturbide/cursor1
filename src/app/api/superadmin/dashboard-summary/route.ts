import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient(cookieStore);

  try {
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

    // Récupérer les statistiques
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: superadmins },
      { count: admins },
      { count: employees }
    ] = await Promise.all([
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'superadmin'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'employee')
    ]);

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      superadmins: superadmins || 0,
      admins: admins || 0,
      employees: employees || 0
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 