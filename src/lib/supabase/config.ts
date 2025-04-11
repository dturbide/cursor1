import { defaultLocale } from '@/i18n/settings';
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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

export const createClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function createServerActionClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export function createRouteHandlerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
} 