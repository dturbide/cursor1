"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface Activity {
  action: string
  entity_type: string
  created_at: string
}

interface RecentActivitiesProps {
  className?: string
}

export function RecentActivities({ className }: RecentActivitiesProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/superadmin/dashboard-summary')
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }
        const data = await response.json()
        setActivities(data.recentActivities || [])
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les activités récentes')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fonction pour obtenir une classe de couleur en fonction du type d'action
  const getActivityColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 dark:bg-green-900';
      case 'update':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'delete':
        return 'bg-rose-100 dark:bg-rose-900';
      default:
        return 'bg-purple-100 dark:bg-purple-900';
    }
  };

  // Fonction pour obtenir une classe de couleur pour le point indicateur
  const getDotColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-500';
      case 'update':
        return 'bg-blue-500';
      case 'delete':
        return 'bg-rose-500';
      default:
        return 'bg-purple-500';
    }
  };

  // Fonction pour formatter l'action de manière lisible
  const formatAction = (action: string, entityType: string) => {
    const actionMap: Record<string, string> = {
      'create': 'Création',
      'update': 'Modification',
      'delete': 'Suppression'
    };
    
    const formattedAction = actionMap[action.toLowerCase()] || action;
    return `${formattedAction} ${entityType}`;
  };

  // Fonction pour formatter le temps relatif
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (e) {
      return 'Date inconnue';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
        <CardDescription>Dernières actions sur la plateforme</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse" />
                </div>
                <div className="grid gap-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-md">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && activities.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Aucune activité récente à afficher
          </div>
        )}

        {!loading && !error && activities.length > 0 && (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`rounded-full ${getActivityColor(activity.action)} p-2`}>
                  <div className={`h-2 w-2 rounded-full ${getDotColor(activity.action)}`} />
                </div>
                <div className="grid gap-1">
                  <p className="font-medium">{formatAction(activity.action, activity.entity_type)}</p>
                  <p className="text-sm text-muted-foreground">{activity.entity_type}</p>
                  <p className="text-xs text-muted-foreground">{getRelativeTime(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
