'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      // Déconnexion directe côté client
      await supabase.auth.signOut();
      
      // Redirection vers la page de login (sans hardcoder le domaine)
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // En cas d'erreur, rediriger quand même
      window.location.href = '/auth/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center w-full p-2 text-gray-600 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="mr-3">
        <i className="icon-logout" aria-hidden="true"></i>
      </span>
      <span>{loading ? 'Déconnexion en cours...' : 'Déconnexion'}</span>
    </button>
  );
} 