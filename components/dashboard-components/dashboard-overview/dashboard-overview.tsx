"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import ClientsTabOverview from "./clients-tab"
import BillCards from "./cards-overview/bills"
import { FinanceTab } from "./finance-tab"
import MikroTikPage from "./mikrotik-tab"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { UserRole } from "@/types/users"

function DashboardOverview() {

  const [selectedTab, setSelectedTab] = useState('clients')
  
  return (
    <Tabs
      // defaultValue="clients"
      onValueChange={setSelectedTab}
      value={selectedTab}
      className="w-full flex flex-col gap-4 h-full"
    >
      {/* --- Top Toolbar (Tabs Header + Actions) --- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: View Selector (small screens) */}
        <div className="flex items-center gap-2">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="clients" value={selectedTab} onValueChange={setSelectedTab}>
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clients">Clients</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="tickets">Tickets</SelectItem>
              <SelectItem value="mikrotik">Mikrotik</SelectItem>
            </SelectContent>
          </Select>

          {/* Tabs List (visible on large screens) */}
          <TabsList className="hidden @4xl/main:flex">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="finance">
              Finance {/*<Badge variant="secondary">2</Badge>*/}
            </TabsTrigger>
            <TabsTrigger value="mikrotik">
              Mikrotik
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* --- Tabs Content Area (Flex below header) --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TabsContent
          value="clients"
          className="flex flex-col gap-4"
        >
            <ClientsTabOverview />
        </TabsContent>

        <TabsContent
          value="finance"
          className="flex flex-col flex-1"
        >
          <FinanceTab />
        </TabsContent>

        <TabsContent
          value="mikrotik"
          className="flex flex-col flex-1"
        >
          <MikroTikPage />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default withRoleGuard(DashboardOverview, {roles: [UserRole.SUPERADMIN, UserRole.ADMIN]})