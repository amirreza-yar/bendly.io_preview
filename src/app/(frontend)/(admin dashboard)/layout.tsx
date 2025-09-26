import { SidebarProvider } from '@/components/uikit/sidebar'
import { ReactNode } from 'react'

export default function AdminDashboardMainLayout({ children }: { children: ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>
}
