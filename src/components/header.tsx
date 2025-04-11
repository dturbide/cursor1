"use client"

import * as React from "react"
import Link from "next/link"
import { Settings, Package2, Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"
import { useSupabase } from '@/lib/supabase'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LanguageSelector } from '@/components/language-selector'
import { MainNav } from '@/components/main-nav'
import { CommandMenu } from '@/components/command-menu'
import { UserNav } from '@/components/user-nav'

export function Header() {
  const { setTheme } = useTheme()
  const router = useRouter()
  const { supabase } = useSupabase()

  const handleLogout = async () => {
    try {
      await supabase?.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
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
            <UserNav onLogout={handleLogout} />
          </nav>
        </div>
      </div>
    </header>
  )
}
