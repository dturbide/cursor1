'use client';

import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const signOut = async () => {
      try {
        // Déconnexion de Supabase
        await supabase.auth.signOut();
        
        // Redirection vers la page de connexion superadmin
        window.location.href = 'https://cursor1-one.vercel.app/auth/superadmin/login';
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, rediriger quand même
        window.location.href = 'https://cursor1-one.vercel.app/auth/superadmin/login';
      }
    };
    
    signOut();
  }, [supabase, router]);
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Déconnexion en cours</h1>
        <p className="text-gray-300">Veuillez patienter...</p>
      </div>
    </div>
  );
} 