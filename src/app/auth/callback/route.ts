import { createRouteHandlerClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // Redirection vers le dashboard après l'authentification
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}
