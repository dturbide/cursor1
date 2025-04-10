import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default async function SuperAdminDashboard() {
  const supabase = createServerComponentClient({ cookies });
  
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-purple-900 shadow-xl border-b border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-300">
                SUPER ADMIN
              </span>
              <span className="ml-4 text-sm bg-purple-700 px-3 py-1 rounded-full">
                VERSION SYSTÈME
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm opacity-75">
                {user?.email}
              </div>
              {/* Bouton de déconnexion */}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm transition"
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section de débogage */}
        <div className="bg-gray-800 p-4 mb-6 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">Informations de débogage</h2>
          <div className="bg-gray-900 p-3 rounded">
            <p className="text-gray-300">Email: <span className="text-yellow-300">{user?.email}</span></p>
            <p className="text-gray-300">Role: <span className="text-yellow-300">{user?.user_metadata?.role || 'Non défini'}</span></p>
            <p className="text-gray-300">ID: <span className="text-yellow-300">{user?.id}</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Gestion Système</h2>
            <p className="text-gray-300 mb-4">Accédez aux paramètres de configuration système.</p>
            <button className="w-full py-2 bg-purple-700 hover:bg-purple-600 rounded shadow transition">
              Configuration système
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Gestion des utilisateurs</h2>
            <p className="text-gray-300 mb-4">Gérez tous les comptes de la plateforme.</p>
            <button className="w-full py-2 bg-purple-700 hover:bg-purple-600 rounded shadow transition">
              Liste des utilisateurs
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Journaux & Sécurité</h2>
            <p className="text-gray-300 mb-4">Accédez aux logs système et paramètres de sécurité.</p>
            <button className="w-full py-2 bg-purple-700 hover:bg-purple-600 rounded shadow transition">
              Consulter les logs
            </button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded transition text-gray-200"
          >
            Retour au tableau de bord standard
          </Link>
        </div>
      </main>
    </div>
  );
} 