'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut();
        router.push('/auth/login');
      } catch (error) {
        console.error('Erreur de déconnexion:', error);
        // Même en cas d'erreur, rediriger vers la page de connexion
        router.push('/auth/login');
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Déconnexion en cours...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
} 