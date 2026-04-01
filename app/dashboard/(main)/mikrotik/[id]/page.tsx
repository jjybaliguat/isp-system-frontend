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
import {  useEffect, useState } from "react"
import PppSecretsTableWrapper from "@/components/wrapper/ppp-secrets-table-wrapper"
import { useParams, useRouter } from "next/navigation"
import PppActiveTableWrapperV2 from "@/components/wrapper/ppp-active-table-wrapper-v2"
import { useGetMikrotikDevicesQuery } from "@/redux/fetures/mikrotik-device-slice"
import PppSecretsTableWrapperV2 from "@/components/wrapper/ppp-secrets-table-wrapper-v2"

const ManageMikrotikPage = () => {
  const { id } = useParams() as { id: string }
  const routerNav = useRouter()

  const [selectedTab, setSelectedTab] = useState("pppactive")

  const { data: routers } = useGetMikrotikDevicesQuery({
    page: 1,
    limit: 100,
    search: "",
  })

  // ✅ Handle router change (updates URL)
  const handleSetSelectedRouter = (routerId: string) => {
    window.location.href = `/dashboard/mikrotik/${routerId}`
  }

  return (
    <PageWrapper
      pageName="Mikrotik PPPoE"
      description="Monitor your mikrotik pppoe clients' connection status with ease"
    >
      {/* 🔹 Router Selector */}
      {/* <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          Router:
        </span>

        <Select value={id} onValueChange={handleSetSelectedRouter}>
          <SelectTrigger className="h-8 w-[200px]">
            <SelectValue placeholder="Select router" />
          </SelectTrigger>

          <SelectContent>
            {routers?.data.map((router) => (
              <SelectItem key={router.id} value={router.id}>
                {router.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* 🔹 Tabs */}
      <Tabs
        onValueChange={setSelectedTab}
        value={selectedTab}
        className="w-full flex flex-col gap-4 h-full"
      >
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="pppactive">Active</TabsTrigger>
            <TabsTrigger value="secrets">Secrets</TabsTrigger>
          </TabsList>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabsContent value="pppactive" className="flex flex-col gap-4">
            <PppActiveTableWrapperV2 mikrotikId={id} />
          </TabsContent>

          <TabsContent value="secrets" className="flex flex-col flex-1">
            <PppSecretsTableWrapperV2 mikrotikId={id} />
          </TabsContent>
        </div>
      </Tabs>
    </PageWrapper>
  )
}

export default withRoleGuard(ManageMikrotikPage, {
  roles: [UserRole.SUPERADMIN, UserRole.ADMIN],
})