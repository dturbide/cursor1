import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';

export default async function SuperAdminRemindersPage() {
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
        heading="Rappels"
        text="Gestion des notifications et rappels automatiques."
      />
      <div className="grid gap-10">
        <p>Contenu de la gestion des rappels...</p>
      </div>
    </DashboardShell>
  );
} 