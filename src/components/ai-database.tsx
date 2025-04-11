"use client"

import { useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function AIDatabase() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleQuery = async () => {
    if (!query.trim()) {
      toast.error("Veuillez entrer une requête")
      return
    }

    setLoading(true)
    setResult("")

    try {
      // Simuler une requête à une base de données IA
      // Dans une version réelle, ceci serait une requête à l'API d'IA
      setTimeout(() => {
        setResult(`Résultats pour la requête: "${query}"\n\nVoici les données extraites de notre base de connaissances améliorée par l'IA. Ces résultats sont générés à partir de l'analyse des tendances et des données historiques.`)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Erreur lors de la requête:", error)
      toast.error("Une erreur est survenue lors de la requête")
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Base de Données IA</CardTitle>
          <CardDescription>
            Posez des questions en langage naturel et obtenez des réponses basées sur nos données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Entrez votre requête en langage naturel..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleQuery} disabled={loading}>
              {loading ? "Traitement en cours..." : "Exécuter la requête"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Résultats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-slate-50 p-4 rounded-md text-slate-800">
              {result}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setResult("")}>
              Effacer les résultats
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 