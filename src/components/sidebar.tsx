"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart4,
  Bell,
  Building2,
  CreditCard,
  FileText,
  Home,
  Package2,
  Settings,
  Shield,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 border-r bg-background", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span>SuperAdmin</span>
          </Link>
        </div>
        <SidebarContent />
      </div>
    </div>
  )
}

export function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="px-3 py-2">
      <div className="space-y-1">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Général</h2>
        <NavItem href="/" icon={Home} active={pathname === "/"}>
          Tableau de bord
        </NavItem>
        <NavItem href="/users" icon={Users} active={pathname === "/users"}>
          Utilisateurs
        </NavItem>
        <NavItem href="/organizations" icon={Building2} active={pathname === "/organizations"}>
          Organisations
        </NavItem>
        <NavItem href="/analytics" icon={BarChart4} active={pathname === "/analytics"}>
          Analytiques
        </NavItem>
      </div>
      <div className="space-y-1 pt-6">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Paiements</h2>
        <NavItem href="/payments" icon={CreditCard} active={pathname === "/payments"}>
          Gestion des paiements
        </NavItem>
        <NavItem href="/reminders" icon={Bell} active={pathname === "/reminders"}>
          Rappels de paiement
        </NavItem>
        <NavItem href="/invoices" icon={FileText} active={pathname === "/invoices"}>
          Factures
        </NavItem>
      </div>
      <div className="space-y-1 pt-6">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Système</h2>
        <NavItem href="/security" icon={Shield} active={pathname === "/security"}>
          Sécurité
        </NavItem>
        <NavItem href="/logs" icon={AlertTriangle} active={pathname === "/logs"}>
          Logs
        </NavItem>
        <NavItem href="/settings" icon={Settings} active={pathname === "/settings"}>
          Paramètres
        </NavItem>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  active?: boolean
  children: React.ReactNode
}

function NavItem({ href, icon: Icon, active, children }: NavItemProps) {
  return (
    <Button asChild variant={active ? "secondary" : "ghost"} size="sm" className="w-full justify-start gap-2">
      <Link href={href}>
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </Link>
    </Button>
  )
}
