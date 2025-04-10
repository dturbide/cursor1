import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/superadmin/login')
  }
  
  // Vérifier si l'utilisateur a le rôle 'superadmin'
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  if (profileError || !profileData || profileData.role !== 'superadmin') {
    console.log('Tentative d\'accès non autorisé à l\'interface superadmin:', session.user.email)
    redirect('/dashboard')
  }
  
  return (
    <div className="superadmin-layout bg-gray-900 min-h-screen">
      {children}
    </div>
  )
} 