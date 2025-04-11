import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/config';
import UserManagement from '@/components/user-management';

export default async function UsersPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // Récupérer les informations utilisateur
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // Vérifier si l'utilisateur a le rôle superadmin
  const userRole = user.user_metadata?.role;
  
  if (userRole !== 'superadmin') {
    redirect('/dashboard');
  }

  // Récupérer les données utilisateurs de la base de données
  await supabase
    .from('user_profiles')
    .select('*');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
      </div>
      
      <UserManagement />
    </div>
  );
} 