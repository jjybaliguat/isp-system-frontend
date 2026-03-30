"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useGetProviderPaymentOptionsQuery } from "@/redux/fetures/provider-api-slice"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetUnpaidBillingByIdQuery } from "@/redux/fetures/billing-api-slice"
import { ArrowLeft, UploadIcon } from "lucide-react"
import { useUploadImageMutation } from "@/redux/fetures/upload-image-slice"
import { sendTelegramMessage } from "@/helpers/sendTelegramMessage"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import { useSubmitPaymentProofMutation } from "@/redux/fetures/clientApiSlice"

export default function PaymentPage() {
    const {data: paymentOptions} = useGetProviderPaymentOptionsQuery()
    const { invoiceId } = useParams() as {invoiceId: string}
    const router = useRouter()
    const [selectedQR, setSelectedQR] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)
    const {data: bill} = useGetUnpaidBillingByIdQuery(invoiceId)
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [uploadImage, {isLoading: uploading}] = useUploadImageMutation()
    const [proofUrl, setProofurl] = useState("")
    const [submitPaymentProof, {isLoading: isSubmitting}] = useSubmitPaymentProofMutation()

    const handleXenditPayment = async() => {
      setProcessing(true)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${invoiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
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

    const handleSubmitProof = async () => {
      if (!proofFile) return;

      try {
        const uploadRes = await uploadImage(proofFile)

        if(uploadRes.error){
          toast.error(uploadRes.error.data.message)
          return
        }

        const paymentProofLink = uploadRes.data?.url;

        if(!paymentProofLink){
          toast.error("Failed to get image URL");
          return;
        }

        if(paymentProofLink) setProofurl(paymentProofLink)

        await submitPaymentProof({billingId: invoiceId, imageUrl: paymentProofLink}).unwrap()

        toast.success("Proof submitted successfully!");
        setProofFile(null);
        setSelectedQR(null);
      } catch (err: any) {
        console.error(err);
        toast.error(err.data.message || err.message || "An error occurred while submitting proof. Please try again.");
      }
    };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">
          <Button size="icon"
          onClick={()=>router.back()}
          ><ArrowLeft /></Button> Payment
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to pay your bill
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-6 items-start">
        
        {/* LEFT: XENDIT */}
        <Card className="rounded-2xl shadow-sm border bg-gradient-to-br from-primary/5 to-primary/10 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg">
              E-Payment
              <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                Recommended
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1">
              <h1>Invoice Num: <span className="font-semibold">{bill?.invoiceNumber}</span></h1>
              <h1>Billing Period: <span className="font-semibold">{bill?.period}</span></h1>
              <h1>Amount: <span className="font-semibold">{bill?.outstandingBalance}</span></h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Pay instantly using online payment methods (GCash, cards, etc.)
            </p>

            <Button
              className="w-full h-12 text-base font-semibold"
              onClick={handleXenditPayment}
              disabled={processing}
            >
              {processing ? "Processing..." : "Pay Online"}
            </Button>
          </CardContent>
        </Card>

        {/* RIGHT: QR / MANUAL */}
        {paymentOptions && paymentOptions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Other Payment Options
            </p>

            {/* GRID becomes 2 cols on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentOptions.map((opt, index) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      opt.qrCodeUrl && setSelectedQR(opt.qrCodeUrl)
                    }
                    className="group border rounded-2xl p-4 hover:shadow-lg transition cursor-pointer active:scale-[0.98]"
                  >
                    {/* HEADER */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {opt.accName}
                        </p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {opt.paymentProvider}
                        </p>
                      </div>

                      {index === 0 && (
                        <span className="text-[10px] bg-muted px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* ACCOUNT */}
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">
                        Account Number
                      </p>
                      <p className="text-sm font-mono font-medium tracking-wide">
                        {opt.accNum}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(opt.accNum);
                          toast.success("Copied!");
                        }}
                      >
                        Copy
                      </Button>

                      {opt.qrCodeUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQR(opt.qrCodeUrl!);
                          }}
                        >
                          View QR
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* QR MODAL */}
      <Dialog open={!!selectedQR} onOpenChange={() => setSelectedQR(null)}>
        <DialogContent className="max-w-md text-center rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Scan to Pay
            </DialogTitle>
          </DialogHeader>

          {selectedQR && (
            <img
              src={selectedQR}
              alt="QR Code"
              className="w-full max-h-[400px] object-contain rounded-xl border shadow-sm"
            />
          )}

          <p className="text-xs text-muted-foreground">
            Use GCash or Maya to scan this QR code
          </p>
          <div className="flex">
            <div className="space-y-2">
              <Button
                onClick={()=>document.getElementById("upload")?.click()}
              >
                <UploadIcon />
                Upload Proof of Payment
              </Button>
              {proofFile && 
                <div className="relative h-[100px] w-[100px]">
                  <Image 
                    src={proofFile ? URL.createObjectURL(proofFile) : ""} 
                    alt="" 
                    fill
                    style={{
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                  />
                </div>
              }
            </div>
            <input
              id="upload"
              type="file"
              accept="image/*"
              className="hidden mt-4"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setProofFile(file);
              }}
            />
          </div>

          <Button
            className="w-full mt-3"
            disabled={!proofFile || uploading || isSubmitting}
            onClick={handleSubmitProof}
          >
            {(uploading || isSubmitting) ? "Submitting..." : "Submit Proof of Payment"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}