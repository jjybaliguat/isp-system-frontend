"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wifi, WifiOff, AlertCircle } from "lucide-react"
import CreateDeviceDialog from "@/components/dialogs/create-device-dialog"
import MikroTikDeviceTable from "@/components/tables/mikrotik-device-table"
import { MikroTikDeviceStatus } from "@/types/mikrotik"

export default function MikroTikPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const isLoading = false
  const error = false

  const data: any = []
//   const { data, isLoading, error } = useGetMikroTikDevicesQuery({
//     page,
//     limit,
//     search,
//     status,
//   })

  const devices = data?.data || []
  const pagination = data?.pagination

  const onlineCount = devices.filter((d: any) => d.status === MikroTikDeviceStatus.ONLINE).length
  const offlineCount = devices.filter((d: any) => d.status === MikroTikDeviceStatus.OFFLINE).length
  const maintenanceCount = devices.filter((d: any) => d.status === MikroTikDeviceStatus.MAINTENANCE).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">MikroTik Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor and manage your network devices</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
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
            <div className="text-2xl font-bold">{pagination?.total || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">All registered devices</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-green-500/5">
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
        </Card>

        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{maintenanceCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Under maintenance</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Table */}
      <MikroTikDeviceTable
        devices={devices}
        isLoading={isLoading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onSearch={setSearch}
        onStatusFilter={setStatus}
      />

      {/* Create Device Dialog */}
      <CreateDeviceDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}
