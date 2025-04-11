'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { getSession, getUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();
  const t = useTranslations('auth');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        
        if (!session) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        if (requiredRole) {
          const profile = await getUserProfile();
          if (!profile || profile.role !== requiredRole || !profile.is_active || profile.is_blocked || profile.deleted) {
            router.push(`/${locale}/dashboard`);
            return;
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error(t('authCheckError'), error);
        router.push(`/${locale}/auth/login`);
      }
    };

    checkAuth();
  }, [router, getSession, getUserProfile, requiredRole, locale, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 