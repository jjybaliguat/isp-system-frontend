"use client"

import { BillingDataSchema, BillingStatus } from "@/types/billing"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { Button } from "../ui/button"
import { formatCurrency } from "@/utils/formatCurrency"
import { CreateBillingDialog } from "../dialogs/create-billing-dialog"
import { useEffect, useState } from "react"
import { getStatusBadge } from "../ui/getBillStatusBadge"

interface BillingDetailsDrawerProps {
  billing: BillingDataSchema
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BillingDetailsDrawer({ billing, open, onOpenChange }: BillingDetailsDrawerProps) {
  const [editBilling, setEditBilling] = useState(false)
  const [billingState, setBillingState] = useState(billing)

  const totalDiscount = billingState?.discounts?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  useEffect(() => {
    if(billing){
      setBillingState(billing)
      console.log("Billing updated in drawer:", billing)
    }
  }, [billing])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <div>
            <SheetTitle className="text-2xl">Billing Details</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Complete billing information
            </SheetDescription>
          </div>
          <Button disabled={billingState?.status === BillingStatus.PAID} type="button" size="sm" variant="outline" onClick={() => setEditBilling(true)}>
            Edit
          </Button>
        </SheetHeader>

        <div className="space-y-6">

          {/* Invoice & Status */}
          <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="text-lg font-semibold">{billingState?.invoiceNumber}</p>
            </div>
            <div>{getStatusBadge(billingState?.status)}</div>
          </div>

          {/* Client Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 shadow-sm">
            <h3 className="font-semibold text-base">Client Information</h3>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">{billingState?.account?.client.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Account #</span>
              <span className="font-medium">{billingState?.account?.client.accountNumber}</span>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 shadow-sm">
            <h3 className="font-semibold text-base">Billing Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Billing Period</p>
                <p className="font-medium">{billingState?.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Date</p>
                <p className="font-medium">{new Date(billingState?.billingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{new Date(billingState?.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(billingState?.amount)}</p>
              </div>
            </div>

            {/* Discounts */}
            {billingState?.discounts && billingState?.discounts.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground font-medium">Discounts</p>
                <div className="space-y-1">
                  {billingState?.discounts.map((d) => (
                    <div key={d.id} className="flex justify-between text-sm">
                      <span>{d.description || "Discount"}</span>
                      <span className="font-medium text-red-600">-₱{d.amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold border-t border-muted/30 pt-1">
                    <span>Total Discount</span>
                    <span className="text-red-600">-₱{totalDiscount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {billingState?.description && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{billingState?.description}</p>
              </div>
            )}
          </div>

          {/* Created & Updated */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground shadow-sm space-y-1">
            <p>Created: {new Date(billingState?.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(billingState?.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </SheetContent>
      <CreateBillingDialog open={editBilling} onOpenChange={setEditBilling} billing={billingState} onUpdateBill={(bill)=>setBillingState(bill)}  />
    </Sheet>
  )
}
