"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Edit,
  FileText,
  MoreHorizontal,
  Search,
  Send,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [organizationFilter, setOrganizationFilter] = useState("all")

  // Exemple de données paiements
  const payments = [
    {
      id: "INV-001",
      organization: "Acme Inc.",
      amount: 5000,
      status: "paid",
      dueDate: "2023-06-15",
      paidDate: "2023-06-10",
      method: "bank_transfer",
      reminders: 0,
    },
    {
      id: "INV-002",
      organization: "Globex Corp.",
      amount: 3000,
      status: "partial",
      dueDate: "2023-06-20",
      paidDate: "2023-06-15",
      method: "credit_card",
      reminders: 1,
    },
    {
      id: "INV-003",
      organization: "Stark Industries",
      amount: 8000,
      status: "overdue",
      dueDate: "2023-06-01",
      paidDate: null,
      method: null,
      reminders: 3,
    },
    {
      id: "INV-004",
      organization: "Wayne Enterprises",
      amount: 3000,
      status: "paid",
      dueDate: "2023-05-20",
      paidDate: "2023-05-18",
      method: "bank_transfer",
      reminders: 0,
    },
    {
      id: "INV-005",
      organization: "Umbrella Corp.",
      amount: 1000,
      status: "pending",
      dueDate: "2023-07-01",
      paidDate: null,
      method: null,
      reminders: 0,
    },
  ]

  // Filtrer les paiements en fonction des critères de recherche et des filtres
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.organization.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesOrganization = organizationFilter === "all" || payment.organization === organizationFilter

    return matchesSearch && matchesStatus && matchesOrganization
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3 w-3" />
            Payé
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Partiel
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En attente
          </Badge>
        )
      case "overdue":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            En retard
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodBadge = (method: string | null) => {
    if (!method) return <span className="text-muted-foreground">-</span>

    switch (method) {
      case "bank_transfer":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Virement bancaire
          </Badge>
        )
      case "credit_card":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Carte de crédit
          </Badge>
        )
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  // Liste des organisations pour le filtre
  const organizations = ["Acme Inc.", "Globex Corp.", "Stark Industries", "Wayne Enterprises", "Umbrella Corp."]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des paiements</CardTitle>
        <CardDescription>Suivez et gérez les paiements des clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="paid">Payés</TabsTrigger>
            <TabsTrigger value="pending">En attente</TabsTrigger>
            <TabsTrigger value="overdue">En retard</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par ID ou organisation..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="partial">Partiel</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par organisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les organisations</SelectItem>
                {organizations.map((org) => (
                  <SelectItem key={org} value={org}>
                    {org}
                  </SelectItem>
                ))}
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
                    ID Facture
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Montant
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
                    <Calendar className="h-4 w-4" />
                    Date d'échéance
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date de paiement
                  </div>
                </TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Rappels</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Aucun paiement trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {payment.organization}
                      </div>
                    </TableCell>
                    <TableCell>${payment.amount.toLocaleString()} CAD</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.dueDate}</TableCell>
                    <TableCell>{payment.paidDate || "-"}</TableCell>
                    <TableCell>{getMethodBadge(payment.method)}</TableCell>
                    <TableCell>
                      {payment.reminders > 0 ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {payment.reminders}
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
                            <CreditCard className="h-4 w-4 mr-2" />
                            Enregistrer un paiement
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Voir la facture
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer un rappel
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
