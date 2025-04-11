import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DashboardShell, DashboardHeader } from '@/components';
import { createServerActionClient } from '@/lib/supabase/server';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';

export default async function SuperAdminAnalyticsPage() {
  const cookieStore = cookies();
  const supabase = createServerActionClient(cookieStore);
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  // Récupérer les informations utilisateur
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect('/auth/login');
  }

  // Vérifier si l'utilisateur a le rôle superadmin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'superadmin') {
    redirect('/dashboard');
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytiques"
        text="Consultez les statistiques et tendances du système."
      />
      <div className="grid gap-10">
        <AnalyticsDashboard />
      </div>
    </DashboardShell>
  );
} 