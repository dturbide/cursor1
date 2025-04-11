"use client"

import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users,
  ShieldAlert,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface Stats {
  totalUsers: number
  activeUsers: number
  superadmins: number
  admins: number
  employees: number
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/superadmin/dashboard-summary")
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des statistiques")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Erreur:", err)
        setError("Impossible de charger les données du tableau de bord")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="text-sm text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Erreur</h3>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test content</p>
        </CardContent>
      </Card>
    </div>
  )
} 