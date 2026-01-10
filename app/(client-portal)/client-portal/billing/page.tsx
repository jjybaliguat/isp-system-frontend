"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useGetClientBillingsQuery } from "@/redux/fetures/clientApiSlice"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "PAID"
      ? "default"
      : status === "PENDING"
      ? "secondary"
      : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}


export default function ClientBilling() {
  const { data, isLoading, isFetching } = useGetClientBillingsQuery()
  const loading = isLoading || isFetching
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const billings = data?.billings || []
  const payments = data?.payments || []

  const convenienceFee = 15;

  const handleProceedPayment = async(invoiceId: string, amount: number) => {
    setProcessing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${invoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount + convenienceFee
        })
      })
      const responseData =  await response.json()
      if(!response.ok){
        toast.error(responseData.message)
        setProcessing(false)
      }else{
        const { xenditInvoiceUrl } = responseData
        setProcessing(false)
        router.push(xenditInvoiceUrl);
      }
    } catch (error) {
      toast.error("Error creating payment link")
      setProcessing(false)
      console.log(error)
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Billing & Payments</h1>

      <Tabs defaultValue="billings">
        <TabsList>
          <TabsTrigger value="billings">Billings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* ================= BILLINGS ================= */}
        <TabsContent value="billings" className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))
          ) : billings.length === 0 ? (
            <p className="text-muted-foreground">No billings found.</p>
          ) : (
            billings.map((b: any) => (
              <Card key={b.id} className="rounded-xl">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-sm">
                      Invoice #{b.invoiceNumber}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Account: {b.account?.accountNumber || "N/A"}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <StatusBadge status={b.status} />
                    {b.outstandingBalance > 0 && <Button disabled={processing} onClick={()=>handleProceedPayment(b.id, b.outstandingBalance)}>{processing? "Processing..." : "PayNow"}</Button>}
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p>{new Date(b.dueDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p>
                      ₱{b.amount.toLocaleString("en-PH")}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Outstanding</p>
                    <p className="font-semibold text-red-600">
                      ₱{b.outstandingBalance.toLocaleString("en-PH")}
                    </p>
                  </div>

                  {b.period && (
                    <div className="col-span-full text-xs text-muted-foreground">
                      {b.period}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* ================= PAYMENTS ================= */}
        <TabsContent value="payments" className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          ) : payments.length === 0 ? (
            <p className="text-muted-foreground">No payments found.</p>
          ) : (
            payments.map((p: any) => (
              <Card key={p.id} className="rounded-xl">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-sm">
                      Invoice #{p.invoiceNumber || "—"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Account: {p.accountNumber || "N/A"}
                    </p>
                  </div>
                  {/* <StatusBadge status={p.status} /> */}
                </CardHeader>

                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p>₱{Number(p.amount).toLocaleString("en-PH")}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Paid At</p>
                    <p>
                      {p.paidAt
                        ? new Date(p.paidAt).toLocaleDateString()
                        : "Pending"}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Method</p>
                    <p>{p.paymentMethod || "—"}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Channel</p>
                    <p>{p.paymentChannel || "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reference Id</p>
                    <p>{p.referenceId || "—"}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
