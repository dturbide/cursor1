'use client';

import { useAuth } from '@/hooks/useAuth';

export default function SignOutButton() {
  const { signOut } = useAuth();

  return (
    <button
      onClick={signOut}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Se déconnecter
    </button>
  );
} 