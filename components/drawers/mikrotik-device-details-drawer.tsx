"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, AlertCircle, Clock, Users, Zap } from "lucide-react"
import { MikroTikDevice } from "@/types/mikrotik"

interface MikroTikDeviceDetailsDrawerProps {
  device: MikroTikDevice
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MikroTikDeviceDetailsDrawer({ device, open, onOpenChange }: MikroTikDeviceDetailsDrawerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ONLINE":
        return <Wifi className="w-5 h-5 text-green-600" />
      case "OFFLINE":
        return <WifiOff className="w-5 h-5 text-red-600" />
      case "MAINTENANCE":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ONLINE":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Online</Badge>
      case "OFFLINE":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Offline</Badge>
      case "MAINTENANCE":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Maintenance</Badge>
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {getStatusIcon(device.status)}
            {device.deviceName}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Device Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(device.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">IP Address</span>
                <span className="font-mono text-sm">{device.ipAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">RouterOS Version</span>
                <span className="text-sm">{device.routerOSVersion}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Client</span>
                <span className="text-sm">{device.clientName || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Active Sessions</p>
                  <p className="text-lg font-semibold">{device.activeSessions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Bandwidth Usage</p>
                  <p className="text-lg font-semibold">{device.bandwidth} Mbps</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Clock className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-lg font-semibold">{device.uptime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Last Checked</p>
                <p>{new Date(device.lastChecked).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(device.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p>{new Date(device.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
