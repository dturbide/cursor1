import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  // Vérifier si l'utilisateur a le rôle superadmin
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    redirect('/auth/login');
  }
  
  const userRole = userData.user.user_metadata?.role;
  
  if (userRole !== 'superadmin') {
    redirect('/dashboard');
  }
  
  // Convertir au format AdminUser
  const currentUser = {
    id: userData.user.id,
    email: userData.user.email,
    created_at: userData.user.created_at,
    user_metadata: userData.user.user_metadata
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tableau de bord SuperAdmin
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Information SuperAdmin</h2>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded mb-6">
            <p className="text-yellow-700">
              ⚠️ Version initiale du tableau de bord SuperAdmin. Les fonctionnalités complètes de gestion des utilisateurs seront implémentées ultérieurement.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <h3 className="font-medium text-lg mb-2">Votre compte SuperAdmin</h3>
            {currentUser && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p><span className="font-medium">ID:</span> {currentUser.id}</p>
                <p><span className="font-medium">Email:</span> {currentUser.email}</p>
                <p><span className="font-medium">Rôle:</span> {currentUser.user_metadata?.role || 'non défini'}</p>
                <p><span className="font-medium">Créé le:</span> {new Date(currentUser.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <a
            href="/dashboard"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Retour au tableau de bord
          </a>
          
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 