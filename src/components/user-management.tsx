"use client"

import { useEffect, useState, useCallback } from "react"
import {
  CheckCircle2,
  Edit,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types/supabase'
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { AddSuperAdminDialog } from "./add-super-admin-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUsers = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Non autorisé');
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setError('Une erreur est survenue lors du chargement des utilisateurs');
        toast.error('Une erreur est survenue lors du chargement des utilisateurs');
      }
    } finally {
      setLoading(false);
    }
  }, [supabase]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          <p className="text-sm text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2 text-red-600">
          <XCircle className="h-8 w-8" />
          <p className="text-sm">Une erreur est survenue : {error}</p>
          <Button variant="outline" size="sm" onClick={fetchUsers}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
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
        <AddSuperAdminDialog onSuccess={fetchUsers} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.is_active)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(user)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleUserStatus(user.id, user.is_active)}
                    className="gap-2"
                  >
                    {user.is_active ? (
                      <>
                        <XCircle className="h-4 w-4" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Activer
                      </>
                    )}
                  </Button>
                  <EditUserDialog 
                    user={user} 
                    open={isEditDialogOpen && editingUser?.id === user.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open);
                      if (!open) setEditingUser(null);
                    }}
                    onSuccess={fetchUsers} 
                  />
                  <DeleteUserDialog 
                    user={user} 
                    open={isDeleteDialogOpen && deletingUser?.id === user.id}
                    onOpenChange={(open) => {
                      setIsDeleteDialogOpen(open);
                      if (!open) setDeletingUser(null);
                    }}
                    onSuccess={fetchUsers} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
