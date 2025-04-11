"use client"

import { useEffect, useState, useCallback } from "react"
import {
  ArrowUpDown,
  CheckCircle2,
  Edit,
  MoreHorizontal,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
import { AddSuperAdminDialog } from "./add-super-admin-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  organization_id: string | null
  is_active: boolean
  created_at: string
}

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  // Fonction pour charger les utilisateurs
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      console.log("Récupération des utilisateurs...")
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        
      if (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error)
        return
      }
      
      console.log("Utilisateurs récupérés:", data)
      setUsers(data || [])
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])
  
  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Fonction pour garantir qu'il y a au moins un superadmin
  const ensureSuperAdmin = useCallback(async () => {
    if (users.length === 0 || !users.some(user => user.role === 'superadmin')) {
      console.log("Aucun superadmin trouvé, vérification de l'utilisateur actuel...")
      
      try {
        // Récupérer l'utilisateur actuel
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          console.log("Utilisateur actuel:", user.email)
          
          // Vérifier si l'utilisateur existe déjà dans user_profiles
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          
          if (!existingProfile) {
            console.log("Création d'un profil superadmin pour l'utilisateur actuel")
            
            // Créer un profil superadmin pour l'utilisateur actuel
            await supabase
              .from('user_profiles')
              .upsert({
                id: user.id,
                email: user.email,
                role: 'superadmin',
                is_active: true,
                created_at: new Date().toISOString()
              })
            
            // Rafraîchir la liste
            fetchUsers()
          } else if (existingProfile.role !== 'superadmin') {
            console.log("Mise à jour du rôle de l'utilisateur actuel en superadmin")
            
            // Mettre à jour le rôle en superadmin
            await supabase
              .from('user_profiles')
              .update({ role: 'superadmin' })
              .eq('id', user.id)
            
            // Rafraîchir la liste
            fetchUsers()
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification/création du superadmin:", error)
      }
    }
  }, [supabase, users, fetchUsers])
  
  // Exécuter la vérification après le chargement des utilisateurs
  useEffect(() => {
    if (!loading && users.length >= 0) {
      ensureSuperAdmin()
    }
  }, [loading, users, ensureSuperAdmin])

  // Filtrer les utilisateurs en fonction des critères de recherche et des filtres
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.is_active) || 
      (statusFilter === "inactive" && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            SuperAdmin
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "employee":
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Employé
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: boolean) => {
    if (status) {
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
        >
          <CheckCircle2 className="h-3 w-3" />
          Actif
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Inactif
        </Badge>
      )
    }
  }

  // Fonction pour changer le statut d'un utilisateur
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId)
      
      if (error) {
        console.error('Erreur lors de la mise à jour du statut:', error)
        toast.error("Erreur lors de la mise à jour du statut")
        return
      }
      
      // Mise à jour de l'état local
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ))
      
      toast.success(`Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`)
    } catch (error) {
      console.error('Erreur:', error)
      toast.error("Une erreur s'est produite")
    }
  }

  // Gestionnaires pour les actions d'édition
  const handleEditClick = (user: UserProfile) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  // Gestionnaire pour l'action de suppression
  const handleDeleteClick = (user: UserProfile) => {
    setDeletingUser(user)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>Gérez les utilisateurs de votre application et leurs rôles</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchUsers()}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Rafraîchir'}
          </Button>
          <AddSuperAdminDialog onSuccess={fetchUsers} />
        </div>
      </CardHeader>
      <CardContent>
        {/* Section de débogage - sera visible uniquement en développement */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md overflow-auto max-h-60">
            <details>
              <summary className="font-medium text-amber-700 cursor-pointer">Informations de débogage ({users.length} utilisateurs)</summary>
              <pre className="mt-2 text-xs text-amber-800 whitespace-pre-wrap">
                {JSON.stringify(users, null, 2)}
              </pre>
            </details>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par nom ou email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="superadmin">SuperAdmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employee">Employé</SelectItem>
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
                    Nom
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-4">
                    Chargement des utilisateurs...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center p-4">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.first_name} {user.last_name || ''}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditClick(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user.id, user.is_active)}>
                            {user.is_active ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Désactiver
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Activer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteClick(user)}>
                            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                            <span className="text-red-600">Supprimer</span>
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

        {/* Dialogues modaux */}
        <EditUserDialog 
          user={editingUser}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSuccess={fetchUsers}
        />
        
        <DeleteUserDialog
          user={deletingUser}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={fetchUsers}
        />
      </CardContent>
    </Card>
  )
}
