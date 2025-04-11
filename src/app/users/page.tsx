"use client"

import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { UserManagement } from "@/components/user-management"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function UsersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Gestion des Utilisateurs" text="Gérez les utilisateurs de votre application">
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </DashboardHeader>
      <UserManagement />
    </DashboardShell>
  )
}
