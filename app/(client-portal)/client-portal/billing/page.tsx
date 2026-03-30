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
import { BillingDetailsDrawer } from "@/components/drawers/billing-details-drawer"
import { ChevronRight, PhilippinePeso } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "PAID"
      ? "default"
      : status === "PENDING"
      ? "secondary" :
      status === "PARTIALLY_PAID"
      ? "outline"
      : "destructive"

  return <Badge variant={variant}>{status}</Badge>
}


export default function ClientBilling() {
  const { data, isLoading, isFetching } = useGetClientBillingsQuery()
  const loading = isLoading || isFetching
  const router = useRouter()
  const billings = data?.billings || []
  const payments = data?.payments || []

  const [openDetails, setOpenDetails] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState<any | null>(null)

  const openBillingDetails = (b: any) => {
    setSelectedBilling(b)
    setOpenDetails(true)
  }

  // const handleUploadProof = async (file: File, billingId?: string) => {
  //   if (!billingId) {
  //     toast.error("No billing selected");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("billingId", billingId);

  //   // try {
  //   //   const res = await fetch("/api/upload-proof", {
  //   //     method: "POST",
  //   //     body: formData,
  //   //     credentials: "include",
  //   //   });

  //   //   const data = await res.json();

  //   //   if (!res.ok) throw new Error(data.message);

  //   //   toast.success("Proof uploaded successfully");
  //   // } catch (err: any) {
  //   //   toast.error(err.message || "Upload failed");
  //   // }
  // };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">My Billing</h1>
            <p className="text-sm text-muted-foreground">Payments & invoices</p>
          </div>
          {/* <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Info className="h-4 w-4 mr-2" /> Help
          </Button> */}
        </header>

        <Tabs defaultValue="billings">
          <TabsList className="rounded-full p-1 bg-muted/50">
            <TabsTrigger value="billings" className="flex-1">Billings</TabsTrigger>
            <TabsTrigger value="payments" className="flex-1">Payments</TabsTrigger>
          </TabsList>

          {/* BILLINGS - mobile-friendly list */}
          <TabsContent value="billings" className="space-y-3 mt-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            ) : billings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No billings found.</p>
            ) : (
              billings.map((b: any) => (
                <Card key={b.id} className="rounded-xl shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => openBillingDetails(b)}
                    className="w-full text-left"
                  >
                    <CardHeader className="flex items-center justify-between px-4 py-3">
                      <div>
                        <CardTitle className="text-sm">Invoice #{b.invoiceNumber}</CardTitle>
                        <p className="text-xs text-muted-foreground">{b.period || b.account?.accountNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold">₱{Number(b.outstandingBalance || b.amount).toLocaleString('en-PH')}</p>
                          <p className="text-xs text-muted-foreground">Due {new Date(b.dueDate).toLocaleDateString()}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </button>

                  <CardContent className="space-y-4 px-4 pb-4 pt-0">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <PhilippinePeso className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <StatusBadge status={b.status} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.outstandingBalance > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => router.push(`/client-portal/billing/payment/${b.id}`)}
                          >
                            Pay
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={()=>openBillingDetails(b)}>View</Button>
                      </div>
                    </div>
                      {/* Row 2: Upload Proof */}
                    {/* {b.status !== "PAID" && <div>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        id={`proof-${b.id}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadProof(file, b?.id); // ⚠️ pass billing id if needed
                        }}
                      />

                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`proof-${b.id}`)?.click();
                        }}
                      >
                        Upload Proof
                      </Button>
                    </div>} */}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* PAYMENTS */}
          <TabsContent value="payments" className="space-y-3 mt-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))
            ) : payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payments found.</p>
            ) : (
              payments.map((p) => (
                <Card key={p.id} className="rounded-xl">
                  <CardHeader className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm">Invoice #{p.invoiceNumber || '—'}</CardTitle>
                      <p className="text-xs text-muted-foreground">{p.paymentChannel} - {p.referenceId || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">₱{Number(p.amount).toLocaleString('en-PH')}</p>
                      <p className="text-xs text-muted-foreground">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : p.status}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BillingDetailsDrawer billing={selectedBilling} open={openDetails} onOpenChange={setOpenDetails} />
    </div>
  )
}
