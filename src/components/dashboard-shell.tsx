import type React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface DashboardShellProps extends React.HTMLAttributes<HTMLDivElement> {
  // Propriétés spécifiques du DashboardShell, si nécessaire
}

export default function DashboardShell({ children, className, ...props }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:block" />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className={cn("mx-auto max-w-7xl", className)} {...props}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
