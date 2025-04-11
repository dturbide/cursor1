import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useSupabase } from '@/lib/supabase/client';

export function usePreferredLanguage() {
  const router = useRouter();
  const locale = useLocale();
  const { supabase } = useSupabase();

  const updatePreferredLanguage = useCallback(async (newLocale: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({ preferred_language: newLocale })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating preferred language:', error);
      }
    } catch (error) {
      console.error('Error in updatePreferredLanguage:', error);
    }
  }, [supabase]);

  // Charger la langue préférée au montage du composant
  useEffect(() => {
    const loadPreferredLanguage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('user_profiles')
          .select('preferred_language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading preferred language:', error);
          return;
        }

        if (data?.preferred_language && data.preferred_language !== locale) {
          // Mettre à jour l'URL avec la langue préférée
          const newPath = window.location.pathname.replace(`/${locale}`, `/${data.preferred_language}`);
          router.push(newPath);
        }
      } catch (error) {
        console.error('Error in loadPreferredLanguage:', error);
      }
    };

    loadPreferredLanguage();
  }, [supabase, locale, router]);

  return { updatePreferredLanguage };
} 