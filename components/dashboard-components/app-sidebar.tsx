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
  IconRouter,
  IconSearch,
  IconSend,
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
import Image from "next/image"

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
      title: "Applicants",
      url: "/dashboard/applicants",
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
      title: "PPP",
      url: "/dashboard/ppp",
      icon: IconRouter,
    }
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
    },
    {
      name: "Telegram",
      url: "/dashboard/telegram-integration",
      icon: IconSend,
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
            navSecondary: data.navSecondary,
            integrations: data.integrations,
          }
      }
      case "ADMIN":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard", "/dashboard/clients", "/dashboard/clients", "/dashboard/applicants", "/dashboard/billing", "/dashboard/tickets", "/dashboard/billing-matrix"].includes(item.url)
          ),
          integrations: undefined,
        }

      case "USER":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard", "/dashboard/tickets"].includes(item.url)
          ),
          integrations: undefined,
          navSecondary: undefined,
        }

      case "INSTALLER_TECHNICIAN":
        return {
          navMain: data.navMain.filter(item =>
            ["/dashboard/assigned-tickets"].includes(item.url)
          ),
          navSecondary: undefined,
          integrations: undefined
        }
      default:
        return { navMain: [], integrations: [], navSecondary: [] }
    }
  }, [user?.role])
  

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0"
            >
              <a
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors w-full"
              >
                {/* Logo */}
                <div className="relative w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0">
                  {!isLoading && provider?.companyLogoUrl ? (
                    <Image
                      src={provider.companyLogoUrl}
                      alt="Company Logo"
                      fill
                      className="object-contain"
                      sizes="40px"
                      priority
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-border animate-pulse" />
                  )}
                </div>

                {/* Provider name */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold block truncate">
                    {provider?.companyName || "Loading"}
                  </span>
                  <span className="text-xs text-muted-foreground block truncate">
                    ISP Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={accessibleNav.navMain} />
        {accessibleNav.integrations && <Integrations items={accessibleNav.integrations} />}
        {accessibleNav.navSecondary && <NavSecondary items={data.navSecondary} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{fullName: user.fullName, email: user.email, role: user.role}} />
      </SidebarFooter>
    </Sidebar>
  )
}
