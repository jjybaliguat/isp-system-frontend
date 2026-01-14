"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [billing, setBilling] = useState<any | null>(null)

  const invoiceId =
    searchParams.get("invoiceId") || searchParams.get("invoice_id") || searchParams.get("id")

  useEffect(() => {
    if (!invoiceId) return

    const fetchBilling = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/${invoiceId}`)
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json?.message || "Failed to fetch billing")
        }
        const json = await res.json()
        setBilling(json)
      } catch (err: any) {
        console.error(err)
        toast.error("Could not load invoice details. It may still be processing.")
      } finally {
        setLoading(false)
      }
    }

    fetchBilling()
  }, [invoiceId])

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center">Payment Successful</CardTitle>
            <p className="text-sm text-muted-foreground text-center">Thank you — your payment has been received.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : billing ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Invoice</span>
                  <span className="font-medium">#{billing.invoiceNumber}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Amount</span>
                  <span className="font-medium">₱{Number(billing.amount).toLocaleString("en-PH")}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Status</span>
                  <span className="font-medium">{billing.status}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                <p>We received a redirect from the payment provider.</p>
                <p className="mt-2">If you don’t see your invoice details yet, it may take a few moments for the payment to be recorded. You can return to your billing list and refresh.</p>
                <pre className="mt-2 p-2 bg-muted/10 rounded text-xs text-muted-foreground">{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button variant="ghost" onClick={() => router.push("/client-portal/billing")} className="flex-1">Back to Billing</Button>
              <Button onClick={() => router.push("/client-portal/billing")} className="flex-1">View My Invoices</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
