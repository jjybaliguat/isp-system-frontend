"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BillingData } from "@/types/billing";

export default function PaymentDetailsPage() {
  const { invoiceId } = useParams();
  const router = useRouter();
  const [data, setData] = useState<BillingData | null>(null);
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/unpaid/${invoiceId}`);
        const json = await res.json();
        console.log(json)
        setData(json);
        setProcessing(false)
      } catch (err) {
        console.error("Failed to load invoice details:", err);
      }
    };

    fetchDetails();
  }, [invoiceId]);

  if (!data) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-gray-500">
        Loading payment details...
      </div>
    );
  }

  const convenienceFee = 15;
  const total = data.amount + convenienceFee;

  const handleProceedPayment = async() => {
    setProcessing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total
        })
      })
      const responseData =  await response.json()
      if(!response.ok){
        setError(responseData.message)
        setProcessing(false)
      }else{
        const { xenditInvoiceUrl } = responseData
        setProcessing(false)
        setError('')
        router.push(xenditInvoiceUrl);
      }
    } catch (error) {
      setError("Error creating payment link")
      setProcessing(false)
      console.log(error)
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-lg dark:bg-gray-900 dark:border-gray-700">
        <h1 className="text-center text-3xl font-semibold text-gray-800 dark:text-white">
          Payment Details
        </h1>

        <div className="mt-8 space-y-4 text-gray-700 dark:text-gray-300">
          <Detail label="Client Name" value={data.client.fullName} />
          <Detail label="Account Number" value={data.client.accountNumber} />
          <Detail label="Invoice Number" value={data.invoiceNumber} />
          <Detail label="Billing Period" value={data.period} />
          <Detail label="Amount Due" value={`₱${data.amount.toFixed(2)}`} />
          <Detail label="Convenience Fee" value={`₱${convenienceFee.toFixed(2)}`} />
          <div className="border-t pt-4">
            <Detail
              label="Total"
              value={`₱${total.toFixed(2)}`}
              bold
            />
          </div>
        </div>

        {error && (
          <div className="w-full mt-4">
            <p className="text-center text-destructive font-medium">{error}</p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Button disabled={processing} size="lg" className="w-full cursor-pointer" onClick={handleProceedPayment}>
            {processing? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Detail({
  label,
  value,
  bold,
}: {
  label: string;
  value: string | undefined;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`${
          bold ? "font-semibold text-gray-900 dark:text-white" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
