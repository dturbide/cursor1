import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <nav className="py-6">
          <div className="flex justify-between items-center">
            <div className="text-white text-2xl font-bold">VotreSaaS</div>
            <div>
              <Link 
                href="/auth/login"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Connexion
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Gérez votre entreprise efficacement
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Solution complète pour la gestion de vos clients, devis et factures
            </p>
            <div className="space-x-4">
              <Link 
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Essai gratuit de 14 jours
              </Link>
              <Link 
                href="/pricing"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Voir les forfaits
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
