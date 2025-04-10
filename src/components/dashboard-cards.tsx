"use client"

import { ArrowUpIcon, Building2, CreditCard, DollarSign, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
      <UserRolesCard />
      <ActiveOrganizationsCard />
      <RevenueCard />
      <PaymentStatusCard />
    </div>
  )
}

export function UserRolesCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Utilisateurs par rôle</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">1,248</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-foreground">42</span> SuperAdmins,
            <span className="font-medium text-foreground"> 156</span> Admins,
            <span className="font-medium text-foreground"> 1,050</span> Employés
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActiveOrganizationsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Organisations</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">128</div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground mt-1">
            <span className="font-medium text-emerald-500">112</span> actives,
            <span className="font-medium text-rose-500"> 16</span> inactives
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RevenueCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Montant total facturé</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$128,250 CAD</div>
        <div className="flex items-center space-x-2">
          <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
          <div className="text-xs text-emerald-500">+12.5% par rapport au mois dernier</div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PaymentStatusCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Statut des paiements</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$98,250 CAD</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-emerald-500">$98,250 CAD</span> reçus
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-rose-500">$30,000 CAD</span> en retard
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
