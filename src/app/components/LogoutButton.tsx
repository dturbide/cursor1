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
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      router.push('/auth/login');
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