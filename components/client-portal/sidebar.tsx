"use client"

import * as React from "react"
import { NavUser } from "@/components/dashboard-components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Logo } from "../ui/logo"
import { useAppSelector } from "@/redux/store/store"
import { CreditCard, FileSpreadsheet, FileText, Headphones, LayoutDashboard, Ticket, User, Wifi } from "lucide-react"
import { useGetProviderQuery } from "@/redux/fetures/provider-api-slice"
import { NavMain } from "./nav-main"


const data = {
  navMain: [
    { title: "Dashboard", url: "/client-portal", icon: LayoutDashboard },
    { title: "Billing", url: "/client-portal/billing", icon: CreditCard },
    { title: "Tickets", url: "/client-portal/tickets", icon: Headphones },
    { title: "Messages", url: "/client-portal/messages", icon: FileText },
    { title: "Profile", url: "/client-portal/profile", icon: User },
  ]
}

export function ClientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((store)=>store.auth)
  const {data: provider, isLoading} = useGetProviderQuery()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                {!isLoading && provider && <Logo logoUrl={provider.companyLogoUrl!} height={70} width={70} />}
                <span className="text-base font-semibold">{user?.fullName?.split(" ")[0]}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{fullName: user.fullName, email: user.email}} />
      </SidebarFooter>
    </Sidebar>
  )
}
