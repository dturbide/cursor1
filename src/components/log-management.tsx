"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ArrowUpDown,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Info,
  MoreHorizontal,
  Search,
  Shield,
  User,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LogManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  // Exemple de données logs
  const logs = [
    {
      id: "LOG-001",
      timestamp: "2023-06-20 14:32:45",
      type: "auth",
      severity: "info",
      message: "Connexion réussie de l'utilisateur jean.dupont@example.com",
      user: "Jean Dupont",
      organization: "Acme Inc.",
      ip: "192.168.1.1",
    },
    {
      id: "LOG-002",
      timestamp: "2023-06-20 14:35:12",
      type: "payment",
      severity: "info",
      message: "Paiement reçu de €5,000 pour la facture INV-001",
      user: "Système",
      organization: "Acme Inc.",
      ip: "-",
    },
    {
      id: "LOG-003",
      timestamp: "2023-06-20 15:10:23",
      type: "auth",
      severity: "warning",
      message: "Tentative de connexion échouée pour l'utilisateur admin@example.com",
      user: "Inconnu",
      organization: "-",
      ip: "203.0.113.1",
    },
    {
      id: "LOG-004",
      timestamp: "2023-06-20 15:45:56",
      type: "reminder",
      severity: "info",
      message: "Rappel de paiement envoyé pour la facture INV-003",
      user: "Système",
      organization: "Stark Industries",
      ip: "-",
    },
    {
      id: "LOG-005",
      timestamp: "2023-06-20 16:20:18",
      type: "security",
      severity: "error",
      message: "Tentative d'accès non autorisé à l'API de paiement",
      user: "Inconnu",
      organization: "-",
      ip: "198.51.100.1",
    },
  ]

  // Filtrer les logs en fonction des critères de recherche et des filtres
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.organization.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || log.type === typeFilter
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter

    return matchesSearch && matchesType && matchesSeverity
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "auth":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <User className="h-3 w-3" />
            Authentification
          </Badge>
        )
      case "payment":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CreditCard className="h-3 w-3" />
            Paiement
          </Badge>
        )
      case "reminder":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Rappel
          </Badge>
        )
      case "security":
        return (
          <Badge variant="outline" className="bg-rose-50  text-rose-700 border-rose-200 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Sécurité
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Avertissement
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Erreur
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logs du système</CardTitle>
        <CardDescription>Consultez les logs et activités du système</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="auth">Authentification</TabsTrigger>
            <TabsTrigger value="payment">Paiements</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher dans les logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="auth">Authentification</SelectItem>
                <SelectItem value="payment">Paiement</SelectItem>
                <SelectItem value="reminder">Rappel</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par sévérité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sévérités</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
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
                    ID
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Horodatage
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Type
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-8 font-medium flex items-center gap-1">
                    Sévérité
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Adresse IP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Aucun log trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {log.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(log.type)}</TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell className="max-w-md truncate">{log.message}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      {log.organization !== "-" ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {log.organization}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{log.ip}</TableCell>
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
                            Détails
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
