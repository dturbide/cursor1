import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardCards } from '@/components/dashboard-cards';

export default async function DashboardPage() {
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
        heading="Tableau de bord"
        text="Bienvenue dans votre espace de travail."
      />
      <div className="grid gap-10">
        <DashboardCards />
      </div>
    </DashboardShell>
  );
}
