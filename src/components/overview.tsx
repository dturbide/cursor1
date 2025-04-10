"use client"

import type React from "react"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface OverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Overview({ className, ...props }: OverviewProps) {
  const data = [
    {
      name: "Jan",
      "Montant facturé": 12000,
      "Paiements reçus": 10000,
      "Paiements en retard": 2000,
    },
    {
      name: "Fév",
      "Montant facturé": 14000,
      "Paiements reçus": 12000,
      "Paiements en retard": 2000,
    },
    {
      name: "Mar",
      "Montant facturé": 16000,
      "Paiements reçus": 14000,
      "Paiements en retard": 2000,
    },
    {
      name: "Avr",
      "Montant facturé": 15000,
      "Paiements reçus": 13000,
      "Paiements en retard": 2000,
    },
    {
      name: "Mai",
      "Montant facturé": 18000,
      "Paiements reçus": 15000,
      "Paiements en retard": 3000,
    },
    {
      name: "Juin",
      "Montant facturé": 20000,
      "Paiements reçus": 16000,
      "Paiements en retard": 4000,
    },
  ]

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Aperçu des paiements</CardTitle>
        <CardDescription>Montants facturés, paiements reçus et paiements en retard des 6 derniers mois</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value} CAD`}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="Montant facturé" fill="#adfa1d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Paiements reçus" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Paiements en retard" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
