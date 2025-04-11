"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardData {
  userCount: number
  orgCount: number
  recentSecurityLogs: number
  recentAuditLogs: number
  userRoles: {
    superadmin: number
    admin: number
    employee: number
  }
  recentActivities: Array<{
    action: string
    entity_type: string
    created_at: string
  }>
}

interface OverviewProps {
  className?: string
}

export function Overview({ className }: OverviewProps) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/superadmin/dashboard-summary')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les données du tableau de bord')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Vue d&apos;ensemble</CardTitle>
          <CardDescription>Statistiques et métriques principales</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border p-3">
              <div className="h-4 w-32 animate-pulse bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-16 animate-pulse bg-gray-200 rounded"></div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="h-4 w-32 animate-pulse bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-16 animate-pulse bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Vue d&apos;ensemble</CardTitle>
          <CardDescription>Statistiques et métriques principales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md mb-4">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const userCount = data?.userCount || 0
  const orgCount = data?.orgCount || 0
  const securityLogsCount = data?.recentSecurityLogs || 0
  const auditLogsCount = data?.recentAuditLogs || 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Vue d&apos;ensemble</CardTitle>
        <CardDescription>Statistiques et métriques principales</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Utilisateurs</div>
            <div className="text-2xl font-bold">{userCount}</div>
            <div className="text-xs text-muted-foreground">Total des utilisateurs</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Organisations</div>
            <div className="text-2xl font-bold">{orgCount}</div>
            <div className="text-xs text-muted-foreground">Total des organisations</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Sécurité</div>
            <div className="text-2xl font-bold">{securityLogsCount}</div>
            <div className="text-xs text-muted-foreground">Événements récents</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Audit</div>
            <div className="text-2xl font-bold">{auditLogsCount}</div>
            <div className="text-xs text-muted-foreground">Actions récentes</div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-medium">Répartition des rôles utilisateurs</div>
          <div className="mt-4 flex h-[60px] items-end gap-2 pb-2">
            {data?.userRoles && (
              <>
                <div 
                  className="bg-primary rounded-sm w-full" 
                  style={{ 
                    height: `${(data.userRoles.superadmin / userCount) * 100}%`,
                    minHeight: data.userRoles.superadmin > 0 ? '4px' : '0'
                  }}
                />
                <div 
                  className="bg-blue-500 rounded-sm w-full" 
                  style={{ 
                    height: `${(data.userRoles.admin / userCount) * 100}%`,
                    minHeight: data.userRoles.admin > 0 ? '4px' : '0'
                  }}
                />
                <div 
                  className="bg-green-500 rounded-sm w-full" 
                  style={{ 
                    height: `${(data.userRoles.employee / userCount) * 100}%`,
                    minHeight: data.userRoles.employee > 0 ? '4px' : '0'
                  }}
                />
              </>
            )}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <div>SuperAdmin: {data?.userRoles?.superadmin || 0}</div>
            <div>Admin: {data?.userRoles?.admin || 0}</div>
            <div>Employé: {data?.userRoles?.employee || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
