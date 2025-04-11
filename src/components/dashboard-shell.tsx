"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
