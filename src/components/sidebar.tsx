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

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64 border-r bg-background", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/superadmin/dashboard" className="flex items-center gap-2 font-semibold">
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
        <NavItem href="/superadmin/dashboard" icon={Home} active={pathname === "/superadmin/dashboard"}>
          Tableau de bord
        </NavItem>
        <NavItem href="/superadmin/users" icon={Users} active={pathname === "/superadmin/users"}>
          Utilisateurs
        </NavItem>
        <NavItem href="/superadmin/organizations" icon={Building2} active={pathname === "/superadmin/organizations"}>
          Organisations
        </NavItem>
        <NavItem href="/superadmin/analytics" icon={BarChart4} active={pathname === "/superadmin/analytics"}>
          Analytiques
        </NavItem>
      </div>
      <div className="space-y-1 pt-6">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Paiements</h2>
        <NavItem href="/superadmin/payments" icon={CreditCard} active={pathname === "/superadmin/payments"}>
          Gestion des paiements
        </NavItem>
        <NavItem href="/superadmin/reminders" icon={Bell} active={pathname === "/superadmin/reminders"}>
          Rappels de paiement
        </NavItem>
        <NavItem href="/superadmin/invoices" icon={FileText} active={pathname === "/superadmin/invoices"}>
          Factures
        </NavItem>
      </div>
      <div className="space-y-1 pt-6">
        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight">Système</h2>
        <NavItem href="/superadmin/security" icon={Shield} active={pathname === "/superadmin/security"}>
          Sécurité
        </NavItem>
        <NavItem href="/superadmin/logs" icon={AlertTriangle} active={pathname === "/superadmin/logs"}>
          Logs
        </NavItem>
        <NavItem href="/superadmin/settings" icon={Settings} active={pathname === "/superadmin/settings"}>
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
