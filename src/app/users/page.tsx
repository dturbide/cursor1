import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';

export default async function UsersPage() {
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

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Utilisateurs"
        text="Gestion des utilisateurs."
      />
      <div className="grid gap-10">
        <p>Contenu de la gestion des utilisateurs...</p>
      </div>
    </DashboardShell>
  );
}
