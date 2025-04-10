import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Overview } from '@/components/overview';
import { DashboardCards } from '@/components/dashboard-cards';
import { RecentActivities } from '@/components/recent-activities';

export default async function SuperAdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
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
  const userRole = user.user_metadata?.role;
  
  if (userRole !== 'superadmin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard SuperAdmin</h2>
      </div>
      
      {/* Cartes d'information */}
      <DashboardCards />

      {/* Graphique de vue d'ensemble */}
      <div className="grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <Overview />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      {/* Section de débogage */}
      <div className="bg-slate-100 dark:bg-slate-800 p-4 mb-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-amber-600 dark:text-amber-400 mb-2">Informations de débogage</h2>
        <div className="bg-white dark:bg-slate-900 p-3 rounded">
          <p className="text-slate-700 dark:text-slate-300">Email: <span className="font-mono text-amber-600 dark:text-amber-400">{user?.email}</span></p>
          <p className="text-slate-700 dark:text-slate-300">Role: <span className="font-mono text-amber-600 dark:text-amber-400">{user?.user_metadata?.role || 'Non défini'}</span></p>
          <p className="text-slate-700 dark:text-slate-300">ID: <span className="font-mono text-amber-600 dark:text-amber-400">{user?.id}</span></p>
        </div>
      </div>
    </div>
  );
} 