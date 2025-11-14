"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface EditNodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeType: string
  nodeId: string
  nodeName: string
  onSuccess: () => void
}

export default function EditNodeDialog({
  open,
  onOpenChange,
  nodeType,
  nodeId,
  nodeName,
  onSuccess,
}: EditNodeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(nodeName)

  useEffect(() => {
    setName(nodeName)
  }, [nodeName, open])

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      const endpoint = nodeType.toLowerCase().replace("ponport", "pon-port")
      const response = await fetch(`/api/network-hierarchy/${endpoint}/${nodeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) throw new Error("Failed to update node")

      toast.success(`${nodeType} updated successfully`)
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast.error("Failed to update node")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {nodeType}</DialogTitle>
          <DialogDescription>Update {nodeType} details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
