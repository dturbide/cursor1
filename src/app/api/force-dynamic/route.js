// Force dynamic pour toutes les pages qui passent par cette route
export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

export async function GET(request) {
  // Retourner une réponse simple pour tester
  return new Response(JSON.stringify({ ok: true, message: "Cette route fonctionne correctement" }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
} 