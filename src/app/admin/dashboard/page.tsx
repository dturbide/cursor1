'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

// Version simplifiée pour le client
interface UserData {
  id: string;
  email?: string;
  created_at: string;
  user_metadata?: {
    role?: string;
    name?: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  
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
        const userRole = userData.user?.user_metadata?.role;
        setCurrentUser(userData.user as UserData);
        
        if (userRole !== 'superadmin') {
          toast.error("Accès non autorisé");
          router.push('/dashboard');
          return;
        }
        
        // Pour l'instant, afficher seulement l'utilisateur actuel
        // En production, il faudrait créer une API ou Edge Function pour récupérer tous les utilisateurs
        setUsers([userData.user as UserData]);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Une erreur est survenue lors du chargement");
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
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
              ⚠️ Version simplifiée du tableau de bord SuperAdmin. Pour une implémentation complète, vous aurez besoin de créer :
            </p>
            <ul className="list-disc ml-6 mt-2 text-yellow-700">
              <li>Une API côté serveur ou des Edge Functions pour accéder aux données utilisateurs</li>
              <li>Des fonctions sécurisées pour la gestion des utilisateurs</li>
              <li>Une interface complète de gestion des utilisateurs</li>
            </ul>
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
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            onClick={() => router.push('/dashboard')}
          >
            Retour au tableau de bord
          </button>
          
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth/login');
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
} 