'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error);
        throw error;
      }

      console.log('Connexion réussie, vérification du rôle...');
      console.log('User ID:', data.user.id);

      // Vérification de la structure de la table
      const { data: tableInfo, error: tableError } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('Erreur lors de la vérification de la table:', tableError);
        throw new Error('Erreur lors de la vérification de la table user_profiles');
      }

      console.log('Structure de la table:', tableInfo);

      // Vérification du rôle superadmin
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (userError) {
        console.error('Erreur lors de la vérification du rôle:', userError);
        throw userError;
      }

      console.log('Données utilisateur:', userData);

      if (!userData) {
        console.error('Aucune donnée utilisateur trouvée');
        throw new Error('Profil utilisateur non trouvé');
      }

      if (userData.role !== 'superadmin') {
        console.error('Rôle non autorisé:', userData.role);
        await supabase.auth.signOut();
        throw new Error('Accès non autorisé. Seuls les super administrateurs peuvent se connecter ici.');
      }

      console.log('Rôle superadmin confirmé, redirection...');
      // Redirection vers le tableau de bord superadmin
      router.push('/superadmin/dashboard');
    } catch (error: unknown) {
      console.error('Erreur complète:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Super Admin - Connexion
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Accès restreint aux administrateurs de niveau système
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-purple-800">
          {error && (
            <div className="mb-4 bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-gray-700 text-white sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Retour à la connexion standard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 