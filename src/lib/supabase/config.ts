import { defaultLocale } from '@/i18n/settings';
import { createBrowserClient } from '@supabase/ssr'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Configuration commune
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Utilitaires d'URL
export const getURL = () => {
  let url = SITE_URL;
  // Supprimer les slashes à la fin
  url = url.replace(/\/$/, '');
  return url;
};

export const getAuthRedirectUrl = (locale = defaultLocale) => {
  return `${getURL()}/${locale}/auth/callback`;
};

export const getAuthCallbackUrl = (locale = defaultLocale) => {
  return `${getURL()}/${locale}/auth/callback`;
};

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const createServerComponentClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookies.set error in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookies.set error in middleware
          }
        },
      },
    }
  )
}

// Re-export from client and server files
export { createClient } from './client'
export { createServerComponentClient } from './server' 