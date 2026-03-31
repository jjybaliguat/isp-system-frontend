"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateMikrotikDeviceMutation } from "@/redux/fetures/mikrotik-device-slice"
import { toast } from "sonner"

interface CreateDeviceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateDeviceDialog({ open, onOpenChange }: CreateDeviceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: ""
  })

  const [createDevice, {isLoading}] = useCreateMikrotikDeviceMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await createDevice({
        name: formData.name,
        username: formData.username,
        password: formData.password,
      }).unwrap()

      toast.success("Device added successfully")

      setFormData({ name: "", username: "", password: "" })
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed: " + (error as any)?.data?.message || "An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add MikroTik Device</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name</Label>
            <Input
              id="deviceName"
              placeholder="e.g., Router-Main-01"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="ipAddress">IP Address</Label>
            <Input
              id="ipAddress"
              placeholder="e.g., 192.168.1.1"
              value={formData.ipAddress}
              onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              required
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="username">Login Username</Label>
            <Input
              id="username"
              placeholder="MikroTik username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Login Password</Label>
            <Input
              id="password"
              type="text"
              placeholder="MikroTik password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
{/* 
          <div className="space-y-2">
            <Label htmlFor="area">Associated Area (Optional)</Label>
            <Input
              id="area"
              placeholder="Associated Area"
              value={formData.associatedArea}
              onChange={(e) => setFormData({ ...formData, associatedArea: e.target.value })}
            />
          </div> */}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add Device"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
