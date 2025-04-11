"use client"

import * as React from "react"
import Link from "next/link"
import { Settings, Package2, Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelector } from '@/components/language-selector'

export function Header() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      router.push('/auth/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center space-x-2">
            <LanguageSelector />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
