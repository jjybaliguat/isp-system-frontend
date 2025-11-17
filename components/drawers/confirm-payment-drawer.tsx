"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner"
import { BillingDataSchema } from "@/types/billing"
import { useConfirmPaymentMutation } from "@/redux/fetures/billing-api-slice"
import { useAppSelector } from "@/redux/store/store"
import { Checkbox } from "../ui/checkbox"

interface ConfirmPaymentDrawerProps {
  billing: BillingDataSchema
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfirmPaymentDrawer({ billing, open, onOpenChange }: ConfirmPaymentDrawerProps) {
  const user = useAppSelector((store)=>store.auth)
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now.getTime() - tzOffset).toISOString().slice(0,16); 
  const [formData, setFormData] = useState({
    amount: "",
    paymentDate: localISO,
    paymentMethod: "CASH",
    referenceNumber: "",
    sendReceipt: false
  })

   useEffect(() => {
    if (billing) {
      setFormData((prev) => ({
        ...prev,
        amount: (billing?.amount - billing?.paidAmount).toString()
      }))
    }
  }, [billing])

  const [confirmPayment, { isLoading }] = useConfirmPaymentMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await confirmPayment({
        billingId: billing?.id,
        amount: Number.parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber,
        sendReceipt: formData.sendReceipt
      }).unwrap()

      setFormData({...formData, referenceNumber: "", amount: ""})

      toast("Success" , {
        description: "Payment confirmed successfully",
      })

      onOpenChange(false)
    } catch (error: any) {
      console.log(error)
      toast("Error" , {
        description: error.data.message
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>Confirm Payment</SheetTitle>
          <SheetDescription>Record payment details for invoice {billing?.invoiceNumber}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Invoice Amount</span>
              <span className="text-lg font-bold">₱{billing?.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="datetime-local"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              required
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CHECK">Check</SelectItem>
                <SelectItem value="GCASH">GCash</SelectItem>
                <SelectItem value="PAYMAYA">PayMaya</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number *</Label>
            <Input
              id="referenceNumber"
              placeholder="Transaction/Reference number"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="send-receipt">Send Receipt</Label>
            <Checkbox checked={formData.sendReceipt} onCheckedChange={(checked: boolean) =>setFormData({...formData, sendReceipt: checked})} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receivedBy">Receipt By *</Label>
            <Input
              id="receivedBy"
              placeholder="Name of person receiving payment"
              value={user?.fullName!}
              disabled
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Confirming..." : "Confirm Payment"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
