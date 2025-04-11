"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UnblockUserButtonProps {
  userId: string;
}

export function UnblockUserButton({ userId }: UnblockUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUnblock = async () => {
    if (!confirm("Êtes-vous sûr de vouloir débloquer cet utilisateur ?")) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/superadmin/security/unblock-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      toast.success('Utilisateur débloqué avec succès');
      
      // Rafraîchir la page pour afficher les changements
      window.location.reload();
    } catch (error: Error | unknown) {
      console.error('Erreur lors du déblocage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du déblocage de l\'utilisateur';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleUnblock}
      disabled={isLoading}
    >
      {isLoading ? 'En cours...' : 'Débloquer'}
    </Button>
  );
} 