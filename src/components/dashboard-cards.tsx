"use client"

import { useEffect, useState } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Users,
  Activity,
  BarChart,
  Calendar
} from "lucide-react"

export function DashboardCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTasks: 0,
    completedTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Dans une application réelle, vous récupéreriez ces données
        // depuis votre API ou votre base de données
        // Simulation de chargement
        setTimeout(() => {
          setStats({
            totalUsers: 120,
            activeUsers: 78,
            totalTasks: 258,
            completedTasks: 194
          })
          setLoading(false)
        }, 800)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les statistiques')
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 w-20 bg-slate-200 rounded-md mb-2"></div>
              <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeUsers} utilisateurs actifs
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux d&apos;activité</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">
            +2% depuis le mois dernier
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tâches</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTasks}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTasks - stats.completedTasks} tâches en cours
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avancement</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.completedTasks} tâches terminées
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
