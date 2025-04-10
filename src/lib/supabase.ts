import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client avec clé anonyme pour les utilisateurs
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client avec clé de service pour les opérations avancées comme l'IA
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Fonction pour interagir avec les tables via l'IA
export async function modifyTableWithAI(
  prompt: string, 
  options?: { 
    schema?: string,
    table?: string,
    context?: string 
  }
) {
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
