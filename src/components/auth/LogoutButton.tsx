'use client';

import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la déconnexion');
      }

      // La redirection sera gérée par le serveur
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setLoading(false);
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