import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClientComponentClient();

export function useSupabase() {
  const [supabaseClient] = useState(() => createClientComponentClient());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
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