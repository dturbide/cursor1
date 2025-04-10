// Fonction Edge Supabase pour la modification de table via IA
// Utilise le MPC Server pour des opérations sécurisées sur la base de données

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestion des requêtes CORS preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, schema, table, context } = await req.json()

    // Validation des entrées
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Un prompt valide est requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Créer un client Supabase (clé de service requise pour admin)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Construire le contexte pour l'IA
    let aiContext = 'Voici les tables et schémas disponibles:\n'
    
    // Si une table spécifique est mentionnée, récupérer sa structure
    if (table) {
      const { data: columns, error: columnsError } = await supabase.rpc('get_table_definition', {
        schema_name: schema || 'public',
        table_name: table
      })
      
      if (columnsError) throw columnsError
      aiContext += `Structure de la table ${schema || 'public'}.${table}:\n${JSON.stringify(columns, null, 2)}\n\n`
    } else {
      // Sinon, lister toutes les tables disponibles
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_schema, table_name')
        .eq('table_schema', schema || 'public')
      
      if (tablesError) throw tablesError
      aiContext += `Tables dans le schéma ${schema || 'public'}:\n${JSON.stringify(tables, null, 2)}\n\n`
    }

    // Ajouter le contexte fourni par l'utilisateur
    if (context) {
      aiContext += `Contexte supplémentaire:\n${context}\n\n`
    }

    // Construction de la requête pour le MPC Server
    const payload = {
      prompt: `${aiContext}\n\nInstruction: ${prompt}`,
      options: {
        model: 'gpt-4', // Ou tout autre modèle supporté par votre MPC Server
        temperature: 0.2,
        // Ajoutez ici d'autres paramètres spécifiques au MPC si nécessaire
      }
    }

    // Pour l'instant, simulons une réponse du MPC Server
    // Dans une implémentation réelle, vous feriez un appel API au MPC Server
    
    // Exemple de réponse simulée (à remplacer par un vrai appel API)
    const aiResponse = {
      sql: `-- Requête SQL générée basée sur le prompt:\n-- ${prompt}\n\n-- Ceci est un exemple. Le vrai MPC Server générerait une requête SQL valide.\nSELECT * FROM ${table || 'exemple_table'} LIMIT 10;`,
      explanation: `Voici l'analyse de votre demande "${prompt}". J'ai généré une requête SQL qui permet de [explication de ce que fait la requête]. Vous pouvez l'exécuter directement dans votre base de données Supabase.`,
    }

    // Retourner la réponse
    return new Response(
      JSON.stringify(aiResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('Error in AI table modification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
}) 