'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LogoutButton({ className = '' }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Vider les cookies et la session
      await supabase.auth.signOut();
      // Force un rafraîchissement complet de la page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      // Même en cas d'erreur, essayer un rafraîchissement complet
      window.location.href = '/auth/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Déconnexion...' : 'Se déconnecter'}
    </button>
  );
} 