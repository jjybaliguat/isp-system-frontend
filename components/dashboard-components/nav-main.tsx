"use client"

import { IconCardsFilled, IconCirclePlusFilled, IconCreditCard, IconMail, IconMap2, IconNotification, IconReport, IconStackMiddle, IconUserCircle, type Icon } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { AddClientDialog } from "../dialogs/add-client-dialog"
import { useState } from "react"
import { CreateBillingDialog } from "../dialogs/create-billing-dialog"
import CreateCoverageDialog from "../dialogs/create-coverage-dialog"
import CreateServicePlanDialog from "../dialogs/create-service-plan-dialog"
import CreateClientTypeDialog from "../dialogs/create-client-type-dialog"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const { isMobile } = useSidebar()
  const [openDialog, setOpenDialog] = useState({
    client: false,
    billing: false,
    coverage: false,
    servicePlan: false,
    clientType: false
  })

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <IconCirclePlusFilled />
                  <span>Quick Create</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={()=>setOpenDialog({...openDialog, client: true})}>
                    <IconUserCircle />
                    Client
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setOpenDialog({...openDialog, billing: true})}>
                    <IconReport />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setOpenDialog({...openDialog, coverage: true})}>
                    <IconMap2 />
                    Coverage
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setOpenDialog({...openDialog, servicePlan: true})}>
                    <IconCardsFilled />
                    Service Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>setOpenDialog({...openDialog, clientType: true})}>
                    <IconStackMiddle />
                    Client Type
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items?.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>

      <AddClientDialog open={openDialog.client} onOpenChange={(open)=>setOpenDialog({...openDialog, client: open})} />
      <CreateBillingDialog open={openDialog.billing} onOpenChange={(open)=>setOpenDialog({...openDialog, billing: open})} />
      <CreateCoverageDialog open={openDialog.coverage} onOpenChange={(open)=>setOpenDialog({...openDialog, coverage: open})} />
      <CreateServicePlanDialog open={openDialog.servicePlan} onOpenChange={(open)=>setOpenDialog({...openDialog, servicePlan: open})} />
      <CreateClientTypeDialog open={openDialog.clientType} onOpenChange={(open)=>setOpenDialog({...openDialog, clientType: open})} />
    </SidebarGroup>
  )
}
