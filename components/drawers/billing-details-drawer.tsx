"use client"

import { BillingDataSchema, BillingStatus } from "@/types/billing"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet"
import { Button } from "../ui/button"
import { formatCurrency } from "@/utils/formatCurrency"
import { CreateBillingDialog } from "../dialogs/create-billing-dialog"
import { useEffect, useMemo, useState } from "react"
import { getStatusBadge } from "../ui/getBillStatusBadge"
import { Separator } from "../ui/separator"
import { useAppSelector } from "@/redux/store/store"
import { UserRole } from "@/types/users"

interface BillingDetailsDrawerProps {
  billing?: BillingDataSchema | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BillingDetailsDrawer({
  billing,
  open,
  onOpenChange,
}: BillingDetailsDrawerProps) {
  const [editBilling, setEditBilling] = useState(false)
  const [billingState, setBillingState] =
    useState<BillingDataSchema | null>(billing ?? null)
  const user = useAppSelector((store)=>store.auth)
  useEffect(() => {
    setBillingState(billing ?? null)
  }, [billing])

  /* =========================
     COMPUTED TOTALS (SAFE)
  ========================= */

  const chargesSubtotal = useMemo(() => {
    if (!billingState) return 0
    return (
      billingState.billingCharges?.reduce(
        (sum, c) => sum + Number(c.amount || 0),
        0
      ) || 0
    )
  }, [billingState])

  const totalDiscount = useMemo(() => {
    if (!billingState) return 0
    return (
      billingState.discounts?.reduce(
        (sum, d) => sum + Number(d.amount || 0),
        0
      ) || 0
    )
  }, [billingState])

  const grandTotal = Math.max(chargesSubtotal - totalDiscount, 0)

  const billingTypeLabel = billingState?.billingType
    ?.replace("_", " ")
    .toUpperCase()

  /* =========================
     EMPTY STATE
  ========================= */

  if (!billingState) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg p-6">
          <SheetHeader>
            <SheetTitle>Billing Details</SheetTitle>
            <SheetDescription>No billing selected</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              Select a billing record to view details
            </p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  /* =========================
     MAIN RENDER
  ========================= */

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader className="flex flex-row items-center justify-between mb-4">
          <div>
            <SheetTitle className="text-2xl">Billing Details</SheetTitle>
            <SheetDescription>
              Complete billing information
            </SheetDescription>
          </div>
          {(user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && <Button
            disabled={billingState.status === BillingStatus.PAID}
            size="sm"
            variant="outline"
            onClick={() => setEditBilling(true)}
          >
            Edit
          </Button>}
        </SheetHeader>

        <div className="space-y-6">
          {/* Invoice & Status */}
          <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Number</p>
              <p className="text-lg font-semibold">
                {billingState.invoiceNumber}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {billingTypeLabel}
              </p>
            </div>
            {getStatusBadge(billingState.status)}
          </div>

          {/* Client Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Client Information</h3>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span>{billingState.account?.client.fullName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account #</span>
              <span>{billingState.account?.accountNumber}</span>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Billing Information</h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Billing Period</p>
                <p>{billingState.period}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Billing Date</p>
                <p>
                  {new Date(
                    billingState.billingDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Due Date</p>
                <p>
                  {new Date(billingState.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Charges */}
            {billingState && billingState.billingCharges && billingState.billingCharges?.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Charges</p>
                  {billingState.billingCharges.map(c => (
                    <div
                      key={c.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{c.name}</span>
                      <span className="font-medium">
                        {formatCurrency(c.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-1">
                    <span>Subtotal</span>
                    <span>{formatCurrency(chargesSubtotal)}</span>
                  </div>
                </div>
              </>
            )}

            {/* Discounts */}
            {billingState.discounts?.length > 0 && (
              <>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Discounts</p>
                  {billingState.discounts.map(d => (
                    <div
                      key={d.id}
                      className="flex justify-between text-sm"
                    >
                      <span>{d.description || "Discount"}</span>
                      <span className="text-red-600">
                        -{formatCurrency(d.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-semibold pt-1">
                    <span>Total Discount</span>
                    <span className="text-red-600">
                      -{formatCurrency(totalDiscount)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Grand Total */}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold">Total Due</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            {/* Remarks */}
            {billingState.remarks && (
              <div className="pt-2 text-sm">
                <p className="text-muted-foreground">Remarks</p>
                <p>{billingState.remarks}</p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground space-y-1">
            <p>
              Created:{" "}
              {new Date(billingState.createdAt).toLocaleString()}
            </p>
            <p>
              Updated:{" "}
              {new Date(billingState.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </SheetContent>

      <CreateBillingDialog
        open={editBilling}
        onOpenChange={setEditBilling}
        billing={billingState}
        onUpdateBill={bill => setBillingState(bill)}
      />
    </Sheet>
  )
}
