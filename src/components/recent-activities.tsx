"use client"

import type React from "react"

import { AlertTriangle, CheckCircle2, Clock, CreditCard, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RecentActivitiesProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentActivities({ className, ...props }: RecentActivitiesProps) {
  const activities = [
    {
      id: 1,
      type: "payment",
      title: "Paiement reçu",
      description: "Acme Inc. a effectué un paiement de €2,500",
      time: "Il y a 5 minutes",
      status: "success",
    },
    {
      id: 2,
      type: "reminder",
      title: "Rappel envoyé",
      description: "Rappel de paiement envoyé à Globex Corp.",
      time: "Il y a 30 minutes",
      status: "pending",
    },
    {
      id: 3,
      type: "user",
      title: "Nouvel utilisateur",
      description: "Jean Dupont a été ajouté à Acme Inc.",
      time: "Il y a 1 heure",
      status: "success",
    },
    {
      id: 4,
      type: "payment",
      title: "Paiement en retard",
      description: "Paiement de Stark Industries en retard de 5 jours",
      time: "Il y a 2 heures",
      status: "error",
    },
    {
      id: 5,
      type: "security",
      title: "Tentative de connexion",
      description: "Tentative de connexion suspecte détectée",
      time: "Il y a 3 heures",
      status: "error",
    },
  ]

  const getIcon = (type: string, status: string) => {
    switch (type) {
      case "payment":
        return status === "success" ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-rose-500" />
        )
      case "reminder":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "user":
        return <User className="h-5 w-5 text-blue-500" />
      case "security":
        return <AlertTriangle className="h-5 w-5 text-rose-500" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Les 5 dernières activités sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="mt-1">{getIcon(activity.type, activity.status)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
