'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

interface CustomError extends Error {
  message: string;
  status?: number;
}

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const supabase = createClientComponentClient();

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileData?.role === 'superadmin') {
          window.location.href = '/superadmin/dashboard';
        }
      }
    };
    checkSession();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setRedirecting(false);

    try {
      console.log('Tentative de connexion avec:', { email, password });
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Erreur de connexion:', signInError);
        throw signInError;
      }

      if (!signInData.user) {
        console.error('Aucun utilisateur retourné après la connexion');
        throw new Error('Aucun utilisateur retourné après la connexion');
      }

      console.log('Connexion réussie, vérification du rôle...');

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', signInData.user.id)
        .single();

      if (profileError) {
        console.error('Erreur lors de la vérification du rôle:', profileError);
        throw profileError;
      }

      if (!profileData || profileData.role !== 'superadmin') {
        console.error('Rôle non autorisé:', profileData?.role);
        throw new Error('Accès non autorisé');
      }

      console.log('Rôle vérifié, redirection vers le dashboard...');
      setRedirecting(true);
      window.location.href = '/superadmin/dashboard';
    } catch (error: unknown) {
      console.error('Erreur complète:', error);
      const customError = error as CustomError;
      setError(customError.message || 'Une erreur est survenue lors de la connexion');
      setLoading(false);
      setRedirecting(false);
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="text-white text-xl">Redirection vers le tableau de bord...</div>
        <div className="mt-4 text-purple-400">Veuillez patienter...</div>
      </div>
    );
  }

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
            <div className="mb-4 bg-red-900/40 border border-red-600 text-red-300 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
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
                disabled={loading || redirecting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion en cours...' : redirecting ? 'Redirection...' : 'Se connecter'}
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