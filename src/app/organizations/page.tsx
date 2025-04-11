"use client"

import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { OrganizationManagement } from "@/components/organization-management"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Gestion des Organisations",
  description: "Gérez les organisations clientes de votre application",
}

export default function OrganizationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Gestion des Organisations" text="Gérez les organisations clientes de votre application">
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Ajouter une organisation
        </Button>
      </DashboardHeader>
      <OrganizationManagement />
    </DashboardShell>
  )
}
