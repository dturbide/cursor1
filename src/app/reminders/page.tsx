"use client"

import type { Metadata } from "next"
import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { ReminderManagement } from "@/components/reminder-management"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export const metadata: Metadata = {
  title: "Rappels de Paiement",
  description: "Gérez les rappels de paiement",
}

export default function RemindersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Rappels de Paiement" text="Gérez les rappels de paiement pour les factures en retard">
        <Button className="gap-1">
          <Settings className="h-4 w-4" />
          Configurer les rappels
        </Button>
      </DashboardHeader>
      <ReminderManagement />
    </DashboardShell>
  )
}
