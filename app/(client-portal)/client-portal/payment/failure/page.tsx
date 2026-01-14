"use client"

import React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-center">Payment Failed</CardTitle>
            <p className="text-sm text-muted-foreground text-center">We couldn't process your payment. No charges were made.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>If you were redirected here from the payment provider, the transaction was not completed.</p>
              <p className="mt-2">You can try again, or contact support if you believe this was a mistake.</p>
              <pre className="mt-2 p-2 bg-muted/10 rounded text-xs text-muted-foreground">{JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}</pre>
            </div>

            <div className="flex gap-2 mt-2">
              <Button variant="ghost" onClick={() => router.push("/client-portal/billing")} className="flex-1">Back to Billing</Button>
              <Button onClick={() => router.push("/client-portal/billing")} className="flex-1">Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
