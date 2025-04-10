'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Link 
      href="/auth/signout"
      className="flex items-center w-full p-2 text-gray-600 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30"
      onClick={() => setLoading(true)}
    >
      <span className="mr-3">
        <i className="icon-logout" aria-hidden="true"></i>
      </span>
      <span>{loading ? 'Déconnexion en cours...' : 'Déconnexion'}</span>
    </Link>
  );
} 