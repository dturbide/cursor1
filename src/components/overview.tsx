"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OverviewProps {
  // Propriétés spécifiques du composant Overview, si nécessaire
  className?: string
}

export function Overview({ className }: OverviewProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Vue d&apos;ensemble</CardTitle>
        <CardDescription>Statistiques et métriques principales</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</div>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-green-500">+10% ce mois</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-sm font-medium text-muted-foreground">Organisations</div>
            <div className="text-2xl font-bold">7</div>
            <div className="text-xs text-green-500">+2 ce mois</div>
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="font-medium">Taux de conversion</div>
          <div className="h-[80px] border-b"></div>
          <div className="flex items-center justify-between p-2">
            <div className="text-sm font-medium">85%</div>
            <div className="text-sm text-muted-foreground">Par rapport à 76% le mois dernier</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
