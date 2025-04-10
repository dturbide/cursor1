'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
