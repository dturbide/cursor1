"use client"

import { useState } from "react"
import { createClient } from '@/lib/supabase/client'
import { 
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

interface DeleteUserDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteUserDialog({ user, open, onOpenChange, onSuccess }: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleDelete = async () => {
    if (!user) return
    
    setLoading(true)

    try {
      // Option 1: Supprimer définitivement l'utilisateur (non recommandé en production)
      // const { error } = await supabase.auth.admin.deleteUser(user.id)

      // Option 2: "Soft delete" - Désactiver l'utilisateur et le marquer comme supprimé
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString(),
          deleted: true
        })
        .eq('id', user.id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      // Enregistrer un log d'audit
      await supabase.rpc('create_audit_log', {
        p_user_id: null, // L'ID de l'utilisateur qui effectue la suppression
        p_organization_id: null,
        p_action: 'delete',
        p_entity_type: 'user',
        p_entity_id: user.id,
        p_old_data: JSON.stringify({ id: user.id, email: user.email }),
        p_new_data: null
      })

      toast.success("Utilisateur supprimé avec succès")
      onOpenChange(false)
      onSuccess()

    } catch (error: Error | unknown) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</AlertDialogTitle>
          <AlertDialogDescription>
            Vous êtes sur le point de supprimer l&apos;utilisateur <strong>{user.email}</strong>.
            Cette action ne peut pas être annulée et l&apos;utilisateur ne pourra plus se connecter à l&apos;application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 