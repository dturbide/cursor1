import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerActionClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/dashboard-shell'
import { DashboardHeader } from '@/components/dashboard-header'
import { AIDatabase } from '@/components/ai-database'

export const metadata = {
  title: 'Éditeur de Base de Données IA | Dashboard',
  description: 'Utilisez l\'IA pour modifier votre base de données Supabase avec des instructions en langage naturel',
}

export default async function AIDatabasePage() {
  const cookieStore = cookies()
  const supabase = createServerActionClient(cookieStore)
  
  const {
    data: { session },
  } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Vérifier si l'utilisateur a les droits d'accès (admin ou autre rôle autorisé)
  const { data: userRole } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
  
  // Rediriger si l'utilisateur n'a pas les droits nécessaires
  if (!userRole || !['admin', 'superadmin'].includes(userRole.role)) {
    redirect('/dashboard')
  }
  
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Base de données IA"
        text="Utilisez notre base de données enrichie par l'IA."
      />
      <div className="grid gap-8">
        <AIDatabase />
      </div>
    </DashboardShell>
  )
} 