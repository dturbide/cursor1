import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Vérifier si l'utilisateur est un superadmin
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Accès interdit' }, { status: 403 });
    }

    // Récupérer les statistiques
    const { count: userCount, error: userError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });

    const { count: orgCount, error: orgError } = await supabase
      .from('organizations')
      .select('*', { count: 'exact', head: true });

    // Compter les logs de sécurité des dernières 24 heures
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: securityLogCount, error: securityLogError } = await supabase
      .from('security_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    // Compter les logs d'audit des dernières 24 heures
    const { count: auditLogCount, error: auditLogError } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', twentyFourHoursAgo);

    if (userError || orgError || securityLogError || auditLogError) {
      console.error('Erreur lors de la récupération des statistiques:', { userError, orgError, securityLogError, auditLogError });
      return NextResponse.json({ error: 'Erreur lors de la récupération des statistiques du tableau de bord' }, { status: 500 });
    }

    // Récupérer les dernières activités d'audit (10 maximum)
    const { data: recentActivities, error: recentActivitiesError } = await supabase
      .from('audit_logs')
      .select('action, entity_type, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Récupérer le nombre d'utilisateurs par rôle
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_profiles')
      .select('role')
      .not('role', 'is', null);

    // Calculer le nombre d'utilisateurs par rôle
    const roleCount = {
      superadmin: 0,
      admin: 0,
      employee: 0
    };

    if (userRoles) {
      userRoles.forEach((user) => {
        if (user.role in roleCount) {
          roleCount[user.role as keyof typeof roleCount]++;
        }
      });
    }

    return NextResponse.json({
      userCount: userCount ?? 0,
      orgCount: orgCount ?? 0,
      recentSecurityLogs: securityLogCount ?? 0,
      recentAuditLogs: auditLogCount ?? 0,
      recentActivities: recentActivities ?? [],
      userRoles: roleCount
    });

  } catch (error) {
    console.error('Erreur API dashboard-summary:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
} 