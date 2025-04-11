"use client"

import DashboardShell from "@/components/dashboard-shell"
import { DashboardHeader } from "@/components/dashboard-header"
import { LogManagement } from "@/components/log-management"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function LogsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Logs du Système" text="Consultez les logs et activités du système">
        <Button className="gap-1">
          <Download className="h-4 w-4" />
          Exporter les logs
        </Button>
      </DashboardHeader>
      <LogManagement />
    </DashboardShell>
  )
}
