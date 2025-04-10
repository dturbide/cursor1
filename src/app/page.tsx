import Link from 'next/link'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export default async function LandingPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

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
              
              <form action="/auth/signout" method="post" className="w-full">
                <button 
                  type="submit"
                  className="w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 flex justify-center"
                >
                  Se déconnecter
                </button>
              </form>
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

        <div className="mt-8 text-center text-base text-gray-500 space-x-4">
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Se connecter au compte standard
          </Link>
          <Link
            href="/auth/superadmin/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Accès Super Admin
          </Link>
        </div>
      </div>
    </div>
  )
} 