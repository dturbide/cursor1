"use client"

import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { PaymentManagement } from "@/components/payment-management"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function PaymentsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Gestion des Paiements" text="Gérez les paiements des clients">
        <Button className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Enregistrer un paiement
        </Button>
      </DashboardHeader>
      <PaymentManagement />
    </DashboardShell>
  )
}
