'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/config';
import type { UserProfile } from '@/types/supabase';

export function useAuth() {
  const router = useRouter();
  const supabase = createClient;
  const locale = useLocale();

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push(`/${locale}/auth/login`);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  };

  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const session = await getSession();
      if (!session) return null;

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  };

  const updateUserLanguage = async (newLocale: 'fr' | 'en') => {
    try {
      const session = await getSession();
      if (!session) return false;

      const { error } = await supabase
        .from('user_profiles')
        .update({ preferred_language: newLocale })
        .eq('id', session.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la langue:', error);
      return false;
    }
  };

  return {
    signOut,
    getSession,
    getUserProfile,
    updateUserLanguage,
  };
} 