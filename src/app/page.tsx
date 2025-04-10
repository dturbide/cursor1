'use client';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js';

export default function LandingPage() {
  // Typé correctement pour éviter le problème de compilation
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      // Explicitement typé pour résoudre l'erreur de compilation
      const userSession: Session | null = data.session;
      setSession(userSession);
      setLoading(false);
    }
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        <h1 className="text-4xl font-bold text-center mb-8">VotreSaaS</h1>
        
        {session ? (
          <div className="text-center space-y-4">
            <p className="text-lg">
              Vous êtes connecté en tant que <span className="font-semibold">{session.user.email}</span>
            </p>
            <div className="flex flex-col space-y-3">
              <Link 
                href="/dashboard" 
                className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 flex justify-center"
              >
                Accéder au tableau de bord
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 flex justify-center"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Link 
              href="/auth/login" 
              className="inline-block py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
            >
              Connexion
            </Link>
          </div>
        )}
        
        <div className="mt-12 space-y-8">
          <h2 className="text-3xl font-bold text-center">Gérez votre entreprise efficacement</h2>
          <p className="text-center text-gray-600">
            Solution complète pour la gestion de vos clients, devis et factures
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Essai gratuit de 14 jours
            </button>
            <button className="bg-white text-blue-600 py-2 px-4 rounded-md border border-blue-600 hover:bg-blue-50">
              Voir les forfaits
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-base text-gray-500">
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
          >
            Se connecter au compte standard
          </Link>
          <Link
            href="/auth/superadmin/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Accès Super Admin
          </Link>
        </p>
      </div>
    </div>
  )
} 