import { createClient } from '@supabase/supabase-js'

// Only initialize the client if we're in the browser
// This prevents errors during server-side rendering and static generation
const supabaseUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL! : '';
const supabaseAnonKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! : '';
const supabaseServiceRoleKey = typeof window !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY! : '';

// Client avec clé anonyme pour les utilisateurs
export const supabase = typeof window !== 'undefined' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Client avec clé de service pour les opérations avancées comme l'IA
export const supabaseAdmin = typeof window !== 'undefined'
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Fonction pour interagir avec les tables via l'IA
export async function modifyTableWithAI(
  prompt: string, 
  options?: { 
    schema?: string,
    table?: string,
    context?: string 
  }
) {
  if (!supabaseAdmin) {
    throw new Error('Supabase client is not initialized');
  }
  
  try {
    // Appel à la fonction Edge ou à l'API MPC Server
    const { data, error } = await supabaseAdmin.functions.invoke('ai-table-modification', {
      body: {
        prompt,
        schema: options?.schema || 'public',
        table: options?.table,
        context: options?.context
      }
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error modifying table with AI:', error)
    return { data: null, error }
  }
}
