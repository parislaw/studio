
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Footprints,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MOCK_CURRENT_USER } from "@/lib/mock-data"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
            <Footprints className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold">StepTracker30</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip={{children: "Dashboard"}}
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/leaderboard"}
                tooltip={{children: "Leaderboard"}}
              >
                <Link href="/leaderboard">
                  <Users />
                  <span>Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {MOCK_CURRENT_USER.isAdmin && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin"}
                  tooltip={{children: "Admin"}}
                >
                  <Link href="/admin">
                    <Shield />
                    <span>Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://placehold.co/40x40.png" alt="User avatar" data-ai-hint="person avatar"/>
                <AvatarFallback>{MOCK_CURRENT_USER.firstName.charAt(0)}{MOCK_CURRENT_USER.lastName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{MOCK_CURRENT_USER.firstName} {MOCK_CURRENT_USER.lastName}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">user@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0" asChild>
                <Link href="/">
                    <LogOut />
                </Link>
              </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-40">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                <h1 className="text-lg font-semibold">
                    {pathname.startsWith('/dashboard') && 'Dashboard'}
                    {pathname.startsWith('/leaderboard') && 'Community Leaderboard'}
                    {pathname.startsWith('/admin') && 'Admin Dashboard'}
                </h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
