'use client';

import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { DashboardShell, DashboardHeader } from '@/components';
import { useSupabase } from '@/lib/supabase/client';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SuperAdminAnalyticsPage() {
  const t = useTranslations('analytics');
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          redirect('/auth/login');
          return;
        }

        // Vérifier si l'utilisateur a le rôle superadmin
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (!userProfile || userProfile.role !== 'superadmin') {
          redirect('/dashboard');
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        redirect('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [supabase]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading={t('title')}
        text={t('description')}
      />
      <div className="grid gap-10">
        <AnalyticsDashboard />
      </div>
    </DashboardShell>
  );
} 