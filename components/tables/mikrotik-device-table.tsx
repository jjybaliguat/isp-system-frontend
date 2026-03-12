"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MikroTikDevice, MikroTikDeviceStatus, MikroTikRemoteStatusResponse } from "@/types/mikrotik"
import MikroTikDeviceDetailsDrawer from "../drawers/mikrotik-device-details-drawer"
import { useCheckDeviceStatusMutation, useDeleteDeviceMutation } from "@/redux/fetures/mikrotik-device-slice"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { toast } from "sonner"

interface MikroTikDeviceTableProps {
  devices: MikroTikDevice[]
  isLoading: boolean
  error: any
  pagination?: any
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSearch: (search: string) => void
  onStatusFilter?: (status: string) => void
}

function GetMikroTikDeviceStatus({ id }: { id: string }) {
  const [data, setData] = useState<MikroTikRemoteStatusResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkDeviceStatus] = useCheckDeviceStatusMutation()
  const [error, setError] = useState<Error | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const intervalMs = 60_000

  const fetchStatus = async () => {
    try {
      setError(null)

      const res = await checkDeviceStatus({id})
      
      console.log(res)
    } catch (err) {
      setError(err as Error)
      setData({
        routerId: id,
        status: "offline",
        remoteAccess: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()

    intervalRef.current = setInterval(fetchStatus, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [id, intervalMs])

  if (isLoading) {
    return <Badge variant="outline">Checking...</Badge>
  }

  if (!data || data.status === "offline") {
    return (
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-red-600" />
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
          Offline
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Wifi className="w-4 h-4 text-green-600" />
      <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
        Online
      </Badge>
    </div>
  )
}


export default function MikroTikDeviceTable({
  devices,
  isLoading,
  error,
  pagination,
  onPageChange,
  onLimitChange,
  onSearch,
  onStatusFilter,
}: MikroTikDeviceTableProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [selectedDevice, setSelectedDevice] = useState<MikroTikDevice | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [deleteDevice, {isLoading: deleting}] = useDeleteDeviceMutation()

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(devices.map((d) => d.id))
    } else {
      setSelectedDevices([])
    }
  }

  const handleSelectDevice = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices([...selectedDevices, id])
    } else {
      setSelectedDevices(selectedDevices.filter((d) => d !== id))
    }
  }

  const handleDeleteDevice = async(id: string) => {
    try {
      await deleteDevice({id}).unwrap()
      toast.success("Device deleted successfully")
    } catch (error) {
      console.log(error)
      toast.error("Error deleting device")
    }
  }

  const getStatusIcon = (status: MikroTikDeviceStatus) => {
    switch (status) {
      case MikroTikDeviceStatus.ONLINE:
        return <Wifi className="w-4 h-4 text-green-600" />
      case MikroTikDeviceStatus.OFFLINE:
        return <WifiOff className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: MikroTikDeviceStatus) => {
    switch (status) {
      case MikroTikDeviceStatus.ONLINE:
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Online</Badge>
      case MikroTikDeviceStatus.OFFLINE:
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Offline</Badge>
    }
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/5">
        <CardContent className="pt-6">
          <p className="text-red-600">Error loading devices. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Devices</CardTitle>
            {selectedDevices?.length > 0 && (
              <div className="text-sm text-muted-foreground">{selectedDevices?.length} selected</div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="Search by name, IP, or client..."
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 min-w-64"
            />
            {/* <Select onValueChange={onStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select> */}
            <Select onValueChange={(value) => onLimitChange(Number.parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedDevices?.length === devices?.length && devices?.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Device Name</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Loading devices...
                    </TableCell>
                  </TableRow>
                ) : devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No devices found
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => (
                    <TableRow key={device.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={(checked) => handleSelectDevice(device.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell className="font-mono text-sm">{device.ipAddress}</TableCell>
                      <TableCell>
                        <GetMikroTikDeviceStatus id={device.id} />
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedDevice(device)
                                setIsDetailsOpen(true)
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Device</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => e.preventDefault()}
                            >
                              <DeleteConfirmAction
                                title="Delete Miktorik"
                                message="Are you sure you want to delete this mikrotik router? This can&apos;t be undone."
                                triggerButton={<Button variant="destructive" size="sm" className="w-full">Delete</Button>}
                                onConfirm={()=>handleDeleteDevice(device.id)}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} devices
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Drawer */}
      {selectedDevice && (
        <MikroTikDeviceDetailsDrawer device={selectedDevice} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </>
  )
}
