'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface AdminUser {
  id: string;
  email?: string | null;
  created_at: string;
  user_metadata?: {
    role?: string;
    name?: string;
  } | null;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/login');
          return;
        }
        
        // Vérifier si l'utilisateur a le rôle superadmin
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          router.push('/auth/login');
          return;
        }
        
        const userRole = userData.user.user_metadata?.role;
        
        if (userRole !== 'superadmin') {
          toast.error("Accès non autorisé - Réservé aux SuperAdmins");
          router.push('/dashboard');
          return;
        }
        
        // Convertir au format AdminUser
        setCurrentUser({
          id: userData.user.id,
          email: userData.user.email,
          created_at: userData.user.created_at,
          user_metadata: userData.user.user_metadata
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Une erreur est survenue");
        router.push('/dashboard');
      }
    };
    
    checkAdminStatus();
  }, [router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
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
                {currentUser?.email}
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/auth/login');
                }}
                className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">Informations SuperAdmin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">ID Utilisateur</p>
              <p className="text-white">{currentUser?.id}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{currentUser?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Rôle</p>
              <p className="text-white">{currentUser?.user_metadata?.role || 'Non défini'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Créé le</p>
              <p className="text-white">{new Date(currentUser?.created_at || '').toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Accès réservé aux administrateurs système. Toutes les actions sont journalisées.
          </p>
        </div>
      </main>
    </div>
  );
} 