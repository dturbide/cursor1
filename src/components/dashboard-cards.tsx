"use client"

import { useEffect, useState } from "react"
import { Building2, CreditCard, Shield, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export function DashboardCards() {
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 animate-pulse bg-gray-200 rounded"></div>
              <div className="h-4 w-4 animate-pulse bg-gray-200 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 w-16 animate-pulse bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-40 animate-pulse bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md mb-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    )
  }

  const totalUsers = data?.userCount || 0
  const superadmins = data?.userRoles.superadmin || 0
  const admins = data?.userRoles.admin || 0
  const employees = data?.userRoles.employee || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
      <UserRolesCard 
        totalUsers={totalUsers} 
        superadmins={superadmins}
        admins={admins}
        employees={employees}
      />
      <ActiveOrganizationsCard orgCount={data?.orgCount || 0} />
      <SecurityLogsCard recentLogs={data?.recentSecurityLogs || 0} />
      <AuditLogsCard recentLogs={data?.recentAuditLogs || 0} />
    </div>
  )
}

interface UserRolesCardProps {
  totalUsers: number
  superadmins: number
  admins: number
  employees: number
}

export function UserRolesCard({ totalUsers, superadmins, admins, employees }: UserRolesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Utilisateurs par rôle</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalUsers}</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{superadmins}</span> SuperAdmins,
            <span className="font-medium text-foreground"> {admins}</span> Admins,
            <span className="font-medium text-foreground"> {employees}</span> Employés
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface OrganizationsCardProps {
  orgCount: number
}

export function ActiveOrganizationsCard({ orgCount }: OrganizationsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Organisations</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{orgCount}</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            Total des organisations enregistrées
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface SecurityLogsCardProps {
  recentLogs: number
}

export function SecurityLogsCard({ recentLogs }: SecurityLogsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Logs de sécurité récents</CardTitle>
        <Shield className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{recentLogs}</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            Activités des dernières 24 heures
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface AuditLogsCardProps {
  recentLogs: number
}

export function AuditLogsCard({ recentLogs }: AuditLogsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Actions d&apos;audit récentes</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{recentLogs}</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            Modifications des dernières 24 heures
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
