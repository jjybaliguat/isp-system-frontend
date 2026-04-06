"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wifi, WifiOff, AlertCircle } from "lucide-react"
import CreateDeviceDialog from "@/components/dialogs/create-device-dialog"
import MikroTikDeviceTable from "@/components/tables/mikrotik-device-table"
import { MikroTikDeviceStatus } from "@/types/mikrotik"
import { useGetMikrotikDevicesQuery } from "@/redux/fetures/mikrotik-device-slice"
import { useAppSelector } from "@/redux/store/store"
import { UserRole } from "@/types/users"

export default function MikroTikPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data, isLoading, error } = useGetMikrotikDevicesQuery({
    page,
    limit,
    search
  })

  const devices = data?.data || []
  const pagination = data?.pagination
  const user = useAppSelector((store)=>store.auth)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MikroTik Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage your network devices</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2" disabled={user.role !== UserRole.SUPERADMIN}>
          <Plus className="w-4 h-4" />
          Add Device
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered devices</p>
          </CardContent>
        </Card>

        {/* <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600 flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Online Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <WifiOff className="w-4 h-4" />
              Offline Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Device Table */}
      <MikroTikDeviceTable
        devices={devices!}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearch={setSearch}
      />

      {/* Create Device Dialog */}
      <CreateDeviceDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} device={null} />
    </div>
  )
}
