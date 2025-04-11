import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export const supabase = createClientComponentClient();

export function useSupabase() {
  const [supabaseClient] = useState(() => createClientComponentClient());

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