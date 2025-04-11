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
import { Button } from "@/components/ui/button"
import { 
  Users,
  ShieldAlert,
  FileText,
  Settings,
  BarChart,
  AlertCircle,
  CheckCircle,
  CircleUser,
  ShieldCheck,
  Shield
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
        const response = await fetch('/api/superadmin/dashboard-summary')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les données du tableau de bord')
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
      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Tous les utilisateurs enregistrés
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalUsers 
                ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% d&apos;utilisateurs actifs`
                : &apos;Aucun utilisateur&apos;}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SuperAdmins</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.superadmins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs avec privilèges système
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.admins || 0}</div>
            <p className="text-xs text-muted-foreground">
              Administrateurs d'organisations
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès direct aux fonctionnalités administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
              <Users className="h-5 w-5" />
              <span>Gestion Utilisateurs</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
              <ShieldAlert className="h-5 w-5" />
              <span>Sécurité</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
              <FileText className="h-5 w-5" />
              <span>Journaux</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2">
              <Settings className="h-5 w-5" />
              <span>Configuration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Carte d'état du système */}
      <Card>
        <CardHeader>
          <CardTitle>État du système</CardTitle>
          <CardDescription>
            Aperçu de l'état de santé et des performances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Base de données</span>
              </div>
              <span className="text-sm text-green-500">Opérationnelle</span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">API</span>
              </div>
              <span className="text-sm text-green-500">Opérationnelle</span>
            </div>
            
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Système d&apos;authentification</span>
              </div>
              <span className="text-sm text-yellow-500">Performance réduite</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Stockage</span>
              </div>
              <span className="text-sm text-green-500">Opérationnel</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques des utilisateurs</CardTitle>
            <CardDescription>
              Informations détaillées sur les utilisateurs du système
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenu détaillé des statistiques d&apos;utilisateurs</p>
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
    </div>
  )
} 