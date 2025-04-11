import { createClient } from '@/lib/supabase/config';
import { useEffect, useState } from 'react';

export function useSupabase() {
  const [supabaseClient] = useState(() => createClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Gérer la déconnexion si nécessaire
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  return { supabase: supabaseClient };
} 