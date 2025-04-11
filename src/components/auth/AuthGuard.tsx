'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { getSession, getUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const locale = useLocale();

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
        console.error('Erreur lors de la verification de l\'authentification:', error);
        router.push(`/${locale}/auth/login`);
      }
    };

    checkAuth();
  }, [router, getSession, getUserProfile, requiredRole, locale]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
} 