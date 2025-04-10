'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LogoutButton from '../auth/LogoutButton'

type NavItem = {
  name: string
  href: string
  icon: string
  roles: string[]
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUserRole() {
      if (!supabase) {
        console.error('Supabase client is not initialized');
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (data) {
          setUserRole(data.role)
        }
      }
      
      setLoading(false)
    }
    
    getUserRole()
  }, [])

  const navigation: NavItem[] = [
    { 
      name: 'Tableau de bord', 
      href: '/dashboard', 
      icon: 'home', 
      roles: ['user', 'admin', 'superadmin'] 
    },
    { 
      name: 'Clients', 
      href: '/dashboard/clients', 
      icon: 'users', 
      roles: ['admin', 'superadmin'] 
    },
    { 
      name: 'Éditeur IA de Base de Données', 
      href: '/dashboard/ai-database', 
      icon: 'database', 
      roles: ['admin', 'superadmin'] 
    },
    { 
      name: 'Administration', 
      href: '/admin/dashboard', 
      icon: 'settings', 
      roles: ['admin', 'superadmin'] 
    },
    { 
      name: 'Super Admin', 
      href: '/superadmin/dashboard', 
      icon: 'shield', 
      roles: ['superadmin'] 
    }
  ]

  const filteredNavigation = loading || !userRole 
    ? [] 
    : navigation.filter(item => item.roles.includes(userRole))

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <span className="mr-3">
                    <i className={`icon-${item.icon}`} aria-hidden="true"></i>
                  </span>
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        
        {userRole === 'superadmin' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="px-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
              Accès Administrateur
            </h3>
            <Link
              href="/superadmin/dashboard"
              className={`flex items-center p-2 rounded-md mb-2 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50`}
            >
              <span className="mr-3">
                <i className="icon-shield" aria-hidden="true"></i>
              </span>
              <span>SuperAdmin Dashboard</span>
            </Link>
          </div>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <LogoutButton />
      </div>
    </aside>
  )
} 