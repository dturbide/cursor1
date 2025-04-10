"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentActivitiesProps {
  // Propriétés spécifiques, si nécessaire
  className?: string
}

export function RecentActivities({ className }: RecentActivitiesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Dernières actions sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">Nouvel utilisateur inscrit</p>
              <p className="text-sm text-muted-foreground">Marie Dupont s'est inscrite</p>
              <p className="text-xs text-muted-foreground">Il y a 15 minutes</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">Paiement reçu</p>
              <p className="text-sm text-muted-foreground">Facture #12345 payée</p>
              <p className="text-xs text-muted-foreground">Il y a 1 heure</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="grid gap-1">
              <p className="font-medium">Nouvelle organisation</p>
              <p className="text-sm text-muted-foreground">TechCorp a rejoint la plateforme</p>
              <p className="text-xs text-muted-foreground">Il y a 3 heures</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
