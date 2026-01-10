"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileBarcode,
  IconFileDescription,
  IconFileSpreadsheet,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconHistory,
  IconInnerShadowTop,
  IconListDetails,
  IconListLetters,
  IconMap,
  IconMessageCheck,
  IconNetwork,
  IconReport,
  IconSearch,
  IconSettings,
  IconTicket,
  IconUsers,
  IconUsersGroup,
  IconWallet,
} from "@tabler/icons-react"

import { Integrations } from "@/components/dashboard-components/integrations-nav"
import { NavMain } from "@/components/dashboard-components/nav-main"
import { NavSecondary } from "@/components/dashboard-components/nav-secondary"
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
import { FileSpreadsheet, Ticket } from "lucide-react"
import { useGetProviderQuery } from "@/redux/fetures/provider-api-slice"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconListDetails,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: IconReport,
    },
    {
      title: "Billing Matrix",
      url: "/dashboard/billing-matrix",
      icon: IconFileSpreadsheet,
    },
    {
      title: "Tickets",
      url: "/dashboard/tickets",
      icon: IconTicket,
    },
    {
      title: "Assigned Tickets",
      url: "/dashboard/assigned-tickets",
      icon: IconTicket,
    },
    {
      title: "Coverage",
      url: "/dashboard/coverage",
      icon: IconMap,
    },
    {
      title: "Service Plans",
      url: "/dashboard/service-plans",
      icon: IconFileBarcode,
    },
    {
      title: "Client Types",
      url: "/dashboard/client-type",
      icon: IconListLetters,
    },
    {
      title: "Employees",
      url: "/dashboard/employees",
      icon: IconUsersGroup,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsersGroup,
    },
    {
      title: "Network Hierarchy",
      url: "/dashboard/network-hierarchy",
      icon: IconNetwork,
    },
    {
      title: "Branches",
      url: "/dashboard/branches",
      icon: IconUsersGroup,
    },
    {
      title: "Logs",
      url: "/dashboard/logs",
      icon: IconHistory,
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  integrations: [
    {
      name: "Xendit",
      url: "/dashboard/xendit-integration",
      icon: IconWallet,
    },
    {
      name: "Semaphore(SMS)",
      url: "/dashboard/semaphore-integration",
      icon: IconMessageCheck,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector((store)=>store.auth)
  const {data: provider, isLoading} = useGetProviderQuery()

   const accessibleNav = React.useMemo(() => {
    if (!user.role) return { navMain: [], integrations: [] }

    switch (user.role) {
      case "SUPERADMIN": {
         return {
            navMain: data.navMain.filter(item =>
              item.url !== "/dashboard/assigned-tickets" &&
              !(user.providerType === "BRANCH" && item.url === "/dashboard/branches")
            ),
            integrations: data.integrations,
          }
      }
      case "ADMIN":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard", "/dashboard/clients", "/dashboard/billing", "/dashboard/tickets", "/dashboard/billing-matrix"].includes(item.url)
          ),
          integrations: undefined,
        }

      case "USER":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard", "/dashboard/tickets"].includes(item.url)
          ),
          integrations: undefined,
        }

      case "INSTALLER_TECHNICIAN":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard/assigned-tickets"].includes(item.url)
          ),
          integrations: undefined,
        }
      default:
        return { navMain: [], integrations: [] }
    }
  }, [user?.role])
  

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
                <span className="text-base font-semibold">{provider?.companyName.split(" ")[0]}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={accessibleNav.navMain} />
        {accessibleNav.integrations && <Integrations items={accessibleNav.integrations} />}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{fullName: user.fullName, email: user.email}} />
      </SidebarFooter>
    </Sidebar>
  )
}
