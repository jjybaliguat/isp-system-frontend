"use client"

import { BillingDataSchema, BillingStatus } from "@/types/billing"
import { Badge } from "../ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet"
import { Separator } from "../ui/separator"

interface BillingDetailsDrawerProps {
  billing: BillingDataSchema
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BillingDetailsDrawer({ billing, open, onOpenChange }: BillingDetailsDrawerProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      [BillingStatus.PAID]: "default",
      [BillingStatus.PENDING]: "secondary",
      [BillingStatus.OVERDUE]: "destructive",
      [BillingStatus.CANCELLED]: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>Billing Details</SheetTitle>
          <SheetDescription>View complete billing information</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Invoice Number</h3>
              <p className="text-lg font-semibold">{billing.invoiceNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <div className="mt-1">{getStatusBadge(billing.status)}</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Client Information</h3>
            <div className="grid gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{billing.client.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">{billing.client.accountNumber}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Billing Information</h3>
            <div className="grid gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Billing Period</p>
                <p className="font-medium">{billing.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Billing Date</p>
                <p className="font-medium">{new Date(billing.billingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{new Date(billing.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">₱{billing.amount.toLocaleString()}</p>
              </div>
              {billing.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{billing.description}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Created: {new Date(billing.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(billing.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
