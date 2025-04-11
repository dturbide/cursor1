import Link from 'next/link';

// Cette page est rendue côté serveur en SSR (pas de prérendu statique)
export const dynamic = 'force-dynamic';

export default function TestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Page de test SSR</h1>
      <p className="text-lg mb-4">Cette page est rendue côté serveur à chaque requête.</p>
      
      <div className="flex flex-col space-y-2 mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
} 