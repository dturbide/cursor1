import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerActionClient } from '@/lib/supabase/server';
import { DashboardShell } from '@/components/dashboard-shell';
import { DashboardHeader } from '@/components/dashboard-header';
import { SuperAdminDashboard } from '@/components/superadmin-dashboard';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string }
};

export default async function SuperAdminDashboardPage({ params: { locale } }: Props) {
  const t = await getTranslations('SuperAdminDashboard');
  const cookieStore = cookies();
  const supabase = createServerActionClient(cookieStore);
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/${locale}/auth/login`);
  }

  // Récupérer les informations utilisateur
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Vérifier si l'utilisateur a le rôle superadmin
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!userProfile || userProfile.role !== 'superadmin') {
    redirect(`/${locale}/dashboard`);
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t('title')}
        text={t('description')}
      />
      <div className="grid gap-10">
        <SuperAdminDashboard />
      </div>
    </DashboardShell>
  );
} 