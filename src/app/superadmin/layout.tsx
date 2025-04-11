"use client"

import { DashboardShell } from "@/components";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
} 