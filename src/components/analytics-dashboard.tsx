"use client"

import { useEffect, useState } from "react"
import { createClient } from '@/lib/supabase/config'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart,
  CircleUser,
  Building,
  ShieldCheck,
  Shield
} from "lucide-react"

interface Stats {
  totalUsers: number
  activeUsers: number
  superadmins: number
  admins: number
  employees: number
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/superadmin/dashboard-summary')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les données analytiques')
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
          <p className="text-sm text-gray-600">Chargement des statistiques...</p>
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
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <CircleUser className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Utilisateurs enregistrés sur la plateforme
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <CircleUser className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Comptes actuellement actifs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SuperAdmins</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.superadmins || 0}</div>
              <p className="text-xs text-muted-foreground">
                Administrateurs système
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.admins || 0}</div>
              <p className="text-xs text-muted-foreground">
                Administrateurs d'organisation
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Distribution des utilisateurs</CardTitle>
              <CardDescription>
                Répartition des utilisateurs par rôle
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-primary"></span>
                        <span>SuperAdmins</span>
                      </div>
                      <span className="font-medium">{stats.superadmins}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-primary" 
                        style={{ 
                          width: `${stats.totalUsers ? (stats.superadmins / stats.totalUsers) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                        <span>Admins</span>
                      </div>
                      <span className="font-medium">{stats.admins}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ 
                          width: `${stats.totalUsers ? (stats.admins / stats.totalUsers) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        <span>Employés</span>
                      </div>
                      <span className="font-medium">{stats.employees}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-green-500" 
                        style={{ 
                          width: `${stats.totalUsers ? (stats.employees / stats.totalUsers) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Activité système</CardTitle>
              <CardDescription>
                Tendances et activité récente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-md">
                  <p className="text-sm font-medium">Taux d'activité</p>
                  <p className="text-2xl font-bold">
                    {stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.activeUsers} utilisateurs actifs sur {stats?.totalUsers}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Statistiques d'accès récentes</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-muted-foreground">Dernière connexion: il y a 10 minutes</li>
                    <li className="text-sm text-muted-foreground">Moyenne des connexions: 42 par jour</li>
                    <li className="text-sm text-muted-foreground">Pics d'activité: 10h-12h et 14h-16h</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des utilisateurs</CardTitle>
            <CardDescription>
              Informations détaillées sur les utilisateurs du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu détaillé des statistiques utilisateurs</p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Rapport de sécurité</CardTitle>
            <CardDescription>
              Suivi des tentatives de connexion et événements de sécurité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu détaillé du rapport de sécurité</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 