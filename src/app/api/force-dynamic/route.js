// Force dynamic pour toutes les pages qui passent par cette route
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export async function GET(request) {
  // Récupérer le chemin demandé
  const url = new URL(request.url)
  const path = url.pathname
  
  // Rediriger vers la page réelle
  // Ce qui se passe ici c'est que nous contournons le prérendu
  // en passant par un handler API qui est toujours dynamique
  return Response.redirect(new URL(path, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'))
} 