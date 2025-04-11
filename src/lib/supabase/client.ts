import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useSupabase() {
  const [supabaseClient] = useState(() => supabase);

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