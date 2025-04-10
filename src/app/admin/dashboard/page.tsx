'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  role?: string;
  name?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  
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
        
        if (userRole !== 'superadmin') {
          toast.error("Accès non autorisé");
          router.push('/dashboard');
          return;
        }
        
        // Récupérer la liste des utilisateurs
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) throw error;
        
        setUsers(data?.users || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        toast.error("Une erreur est survenue lors du chargement des utilisateurs");
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);
  
  const handlePromoteToAdmin = async (userId: string) => {
    try {
      // Mettre à jour les métadonnées utilisateur
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: 'admin' } }
      );
      
      if (error) throw error;
      
      toast.success("L'utilisateur a été promu administrateur");
      
      // Rafraîchir la liste
      const { data, error: fetchError } = await supabase.auth.admin.listUsers();
      
      if (fetchError) throw fetchError;
      
      setUsers(data?.users || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de mettre à jour le rôle de l'utilisateur");
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast.success("L'utilisateur a été supprimé");
      
      // Mettre à jour la liste
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de supprimer l'utilisateur");
    }
  };
  
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
          <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Créé le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.user_metadata?.name || 'Non défini'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.user_metadata?.role === 'superadmin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : user.user_metadata?.role === 'admin' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {user.user_metadata?.role || 'utilisateur'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(!user.user_metadata?.role || user.user_metadata?.role !== 'admin' && user.user_metadata?.role !== 'superadmin') && (
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => handlePromoteToAdmin(user.id)}
                        >
                          Promouvoir admin
                        </button>
                      )}
                      {(!user.user_metadata?.role || user.user_metadata?.role !== 'superadmin') && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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