import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

export const createClient = () => {
  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  )
} 