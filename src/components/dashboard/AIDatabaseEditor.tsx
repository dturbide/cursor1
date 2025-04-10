'use client'

import { useState, useRef } from 'react'
import { modifyTableWithAI } from '@/lib/supabase'

type AIResponse = {
  sql: string
  explanation: string
}

export default function AIDatabaseEditor() {
  const [prompt, setPrompt] = useState('')
  const [schema, setSchema] = useState('public')
  const [table, setTable] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<AIResponse | null>(null)
  const sqlRef = useRef<HTMLPreElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await modifyTableWithAI(prompt, {
        schema,
        table: table || undefined,
        context: context || undefined
      })

      if (result.error) {
        throw new Error(result.error instanceof Error ? result.error.message : 'Une erreur est survenue')
      }

      setResponse(result.data as AIResponse)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (sqlRef.current && response) {
      navigator.clipboard.writeText(response.sql)
        .then(() => {
          // Optionally show a success message
          alert('SQL copié dans le presse-papiers')
        })
        .catch(err => {
          console.error('Erreur lors de la copie:', err)
        })
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Éditeur de Base de Données IA</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Utilisez des instructions en langage naturel pour manipuler votre base de données Supabase
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Schéma (par défaut: public)
            </label>
            <input
              type="text"
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nom du schéma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Table (optionnel)
            </label>
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Laissez vide pour toutes les tables"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contexte supplémentaire (optionnel)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Informations additionnelles pour aider l'IA"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instruction pour l&apos;IA
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              required
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ex: Crée une table &apos;produits&apos; avec des champs pour nom, prix et description"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {loading ? 'Traitement en cours...' : 'Générer SQL avec IA'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 dark:bg-red-900/20 dark:border-red-600">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {response && (
        <div className="bg-white shadow-sm rounded-lg p-6 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Réponse générée</h3>
            <button
              onClick={copyToClipboard}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Copier SQL
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explication</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {response.explanation}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SQL</h4>
            <div className="relative">
              <pre
                ref={sqlRef}
                className="bg-gray-50 p-4 rounded-md overflow-x-auto text-sm font-mono text-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {response.sql}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 