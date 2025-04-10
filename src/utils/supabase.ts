import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esjybkwmwtxdnfkzmutc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzanlia3dtd3R4ZG5ma3ptdXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDk1MjEsImV4cCI6MjA1OTgyNTUyMX0.5Rl3hgwnuQiC3rQUjvBnGKcf2haEOjQU00BR-c9NZr4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
})
