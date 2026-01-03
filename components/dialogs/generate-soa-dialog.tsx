"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ClientDataSchema } from "@/types/clients"
import { toast } from "sonner"
import Link from "next/link"

interface GenerateSoaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: ClientDataSchema | null
}

const GenerateSoaDialog = ({
  open,
  onOpenChange,
  client,
}: GenerateSoaDialogProps) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleGenerate = async () => {
    if (!client?.id) return

    if (!startDate || !endDate) {
      toast.error("Please select a start and end date")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Start date cannot be later than end date")
      return
    }
    
    const url = `/dashboard/soa/${client.id}?startDate=${startDate}&endDate=${endDate}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Statement of Account</DialogTitle>
          <DialogDescription>
            Select the billing period for this client.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Generate statement of account for{" "}
            <span className="font-medium text-foreground">
              {client?.fullName}
            </span>
          </p>

          <div className="grid gap-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button onClick={handleGenerate}>
                View SOA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateSoaDialog
