"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  Building2,
  Calendar,
  Check,
  CreditCard,
  Edit,
  FileText,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Send,
  XCircle,
  CalendarCheck,
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

export function ReminderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [organizationFilter, setOrganizationFilter] = useState("all")

  // Exemple de données rappels
  const reminders = [
    {
      id: "REM-001",
      invoiceId: "INV-003",
      organization: "Stark Industries",
      amount: 8000,
      dueDate: "2023-06-01",
      status: "sent",
      sentDate: "2023-06-05",
      type: "email",
      level: 1,
    },
    {
      id: "REM-002",
      invoiceId: "INV-003",
      organization: "Stark Industries",
      amount: 8000,
      dueDate: "2023-06-01",
      status: "sent",
      sentDate: "2023-06-10",
      type: "email",
      level: 2,
    },
    {
      id: "REM-003",
      invoiceId: "INV-003",
      organization: "Stark Industries",
      amount: 8000,
      dueDate: "2023-06-01",
      status: "sent",
      sentDate: "2023-06-15",
      type: "sms",
      level: 3,
    },
    {
      id: "REM-004",
      invoiceId: "INV-002",
      organization: "Globex Corp.",
      amount: 3000,
      dueDate: "2023-06-20",
      status: "sent",
      sentDate: "2023-06-25",
      type: "email",
      level: 1,
    },
    {
      id: "REM-005",
      invoiceId: "INV-005",
      organization: "Umbrella Corp.",
      amount: 1000,
      dueDate: "2023-07-01",
      status: "scheduled",
      sentDate: "2023-07-05",
      type: "email",
      level: 1,
    },
  ]

  // Filtrer les rappels en fonction des critères de recherche et des filtres
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch =
      reminder.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.organization.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reminder.status === statusFilter
    const matchesOrganization = organizationFilter === "all" || reminder.organization === organizationFilter

    return matchesSearch && matchesStatus && matchesOrganization
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Envoyé
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Planifié
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Échec
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "email":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            Email
          </Badge>
        )
      case "sms":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            SMS
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Niveau 1
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Niveau 2
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
            Niveau 3
          </Badge>
        )
      default:
        return <Badge variant="outline">Niveau {level}</Badge>
    }
  }

  // Liste des organisations pour le filtre
  const organizations = ["Stark Industries", "Globex Corp.", "Umbrella Corp."]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des rappels de paiement</CardTitle>
        <CardDescription>Suivez et gérez les rappels de paiement pour les factures en retard</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="sent">Envoyés</TabsTrigger>
            <TabsTrigger value="scheduled">Planifiés</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par ID, facture ou organisation..."
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
                <SelectItem value="sent">Envoyé</SelectItem>
                <SelectItem value="scheduled">Planifié</SelectItem>
                <SelectItem value="failed">Échec</SelectItem>
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
                    ID Rappel
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>ID Facture</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Montant
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date d&apos;échéance
                  </div>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Statut
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <CalendarCheck className="h-4 w-4" />
                    Date d&apos;envoi
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReminders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">Aucun rappel n&apos;a été trouvé.</span>
                      <span className="text-sm text-muted-foreground">
                        Les rappels apparaîtront ici une fois qu&apos;ils auront été créés.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">{reminder.id}</TableCell>
                    <TableCell>{reminder.invoiceId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {reminder.organization}
                      </div>
                    </TableCell>
                    <TableCell>${reminder.amount.toLocaleString()} CAD</TableCell>
                    <TableCell>{reminder.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                    <TableCell>{reminder.sentDate}</TableCell>
                    <TableCell>{getTypeBadge(reminder.type)}</TableCell>
                    <TableCell>{getLevelBadge(reminder.level)}</TableCell>
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
                            <FileText className="h-4 w-4 mr-2" />
                            Voir le contenu
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Voir la facture
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Renvoyer
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
