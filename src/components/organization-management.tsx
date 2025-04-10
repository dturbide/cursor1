"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Building2,
  CheckCircle2,
  CreditCard,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function OrganizationManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Exemple de données organisations
  const organizations = [
    {
      id: 1,
      name: "Acme Inc.",
      plan: "enterprise",
      status: "active",
      users: 42,
      billedAmount: 5000,
      paidAmount: 5000,
      paymentStatus: "paid",
      lastPayment: "2023-06-15",
      reminders: 0,
    },
    {
      id: 2,
      name: "Globex Corp.",
      plan: "business",
      status: "active",
      users: 28,
      billedAmount: 3000,
      paidAmount: 1500,
      paymentStatus: "partial",
      lastPayment: "2023-06-10",
      reminders: 1,
    },
    {
      id: 3,
      name: "Stark Industries",
      plan: "enterprise",
      status: "active",
      users: 65,
      billedAmount: 8000,
      paidAmount: 0,
      paymentStatus: "overdue",
      lastPayment: "2023-05-15",
      reminders: 3,
    },
    {
      id: 4,
      name: "Wayne Enterprises",
      plan: "business",
      status: "inactive",
      users: 0,
      billedAmount: 3000,
      paidAmount: 3000,
      paymentStatus: "paid",
      lastPayment: "2023-04-20",
      reminders: 0,
    },
    {
      id: 5,
      name: "Umbrella Corp.",
      plan: "starter",
      status: "active",
      users: 12,
      billedAmount: 1000,
      paidAmount: 1000,
      paymentStatus: "paid",
      lastPayment: "2023-06-18",
      reminders: 0,
    },
  ]

  // Filtrer les organisations en fonction des critères de recherche et des filtres
  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = planFilter === "all" || org.plan === planFilter
    const matchesStatus = statusFilter === "all" || org.status === statusFilter

    return matchesSearch && matchesPlan && matchesStatus
  })

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Enterprise
          </Badge>
        )
      case "business":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Business
          </Badge>
        )
      case "starter":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Starter
          </Badge>
        )
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Actif
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Inactif
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Payé
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Partiel
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            En retard
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentProgress = (billed: number, paid: number) => {
    const percentage = (paid / billed) * 100
    let color = "bg-emerald-500"

    if (percentage === 0) {
      color = "bg-rose-500"
    } else if (percentage < 100) {
      color = "bg-amber-500"
    }

    return (
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs">
          <span>${paid} CAD</span>
          <span>${billed} CAD</span>
        </div>
        <Progress value={percentage} className={color} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des organisations</CardTitle>
        <CardDescription>Gérez les organisations clientes et leurs abonnements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les plans</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Organisation
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Plan
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Statut
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Utilisateurs
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />
                    Paiements
                  </div>
                </TableHead>
                <TableHead>Dernier paiement</TableHead>
                <TableHead>Rappels</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Aucune organisation trouvée.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {org.name}
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(org.plan)}</TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell>{org.users}</TableCell>
                    <TableCell className="w-40">
                      <div className="space-y-1">
                        {getPaymentProgress(org.billedAmount, org.paidAmount)}
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {getPaymentStatusBadge(org.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{org.lastPayment}</TableCell>
                    <TableCell>
                      {org.reminders > 0 ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {org.reminders}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            Gérer les utilisateurs
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Gérer les paiements
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
