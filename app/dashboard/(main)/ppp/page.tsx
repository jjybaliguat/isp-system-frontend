"use client"

import AccessDenied from "@/components/accessDenied"
import PageWrapper from "@/components/wrapper/page-wrapper"
import PppActiveTableWrapper from "@/components/wrapper/ppp-active-table-wrapper"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { useAppSelector } from "@/redux/store/store"
import { UserRole } from "@/types/users"
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
import { useState } from "react"
import PppSecretsTableWrapper from "@/components/wrapper/ppp-secrets-table-wrapper"

const PPPMonitorPage = () => {
  const user = useAppSelector(store=>store.auth)
  const [selectedTab, setSelectedTab] = useState('pppactive')

  if(user.providerType !== "MAIN") return <AccessDenied />

  return (

    <PageWrapper
      pageName="Mikrotik PPPoE"
      description="Monitor your mikrotik pppoe clients' connection status with ease"
    > 
        <Tabs
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
              {/* <Select defaultValue="pppactive" value={selectedTab} onValueChange={setSelectedTab}>
                <SelectTrigger
                  className="flex w-fit @4xl/main:hidden"
                  size="sm"
                  id="view-selector"
                >
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pppactive">Active</SelectItem>
                  <SelectItem value="secrets">Secrets</SelectItem>
                </SelectContent>
              </Select> */}

              {/* Tabs List (visible on large screens) */}
              <TabsList className="">
                <TabsTrigger value="pppactive">Active</TabsTrigger>
                <TabsTrigger value="secrets">
                  Secrets
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* --- Tabs Content Area (Flex below header) --- */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent
              value="pppactive"
              className="flex flex-col gap-4"
            >
              <PppActiveTableWrapper />
            </TabsContent>

            <TabsContent
              value="secrets"
              className="flex flex-col flex-1"
            >
              <PppSecretsTableWrapper />
            </TabsContent>
          </div>
        </Tabs>
    </PageWrapper>

  )

}

export default withRoleGuard(PPPMonitorPage, {roles: [UserRole.SUPERADMIN, UserRole.ADMIN]})