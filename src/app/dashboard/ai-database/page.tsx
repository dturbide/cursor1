import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import AIDatabaseEditor from '@/components/dashboard/AIDatabaseEditor'

export const metadata = {
  title: 'Éditeur de Base de Données IA | Dashboard',
  description: 'Utilisez l\'IA pour modifier votre base de données Supabase avec des instructions en langage naturel',
}

export default async function AIDatabasePage() {
  const supabase = createServerComponentClient({ cookies })
  
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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Éditeur de Base de Données IA
      </h1>
      <AIDatabaseEditor />
    </div>
  )
} 