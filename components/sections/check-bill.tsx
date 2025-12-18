"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { BillingData } from "@/types/billing";

export default function CheckBillSection() {
  const [accountNumber, setAccountNumber] = useState("");
  const [billing, setBilling] = useState<BillingData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckBill = async () => {
    setError("");
    setBilling(null);
    if (!accountNumber.trim()) {
      setError("Please enter your account number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/get-bills/${accountNumber}`);
      if (!res.ok) throw new Error("No bill found for this account number.");
      const data = await res.json();
      setBilling(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="bill" className="py-20 bg-muted/80 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-6">
        <div className={`grid gap-8 ${
          billing && billing.length > 0
          ? "md:grid-cols-2"
          : "grid-cols-1"
        }`}>
          <div
            className={`flex flex-col text-center md:text-left transition-all duration-300 ${
              billing && billing.length > 0
                ? "justify-start md:justify-center"
                : "justify-center min-h-[480px]"
            }`}
          >
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white md:text-4xl text-center">
              Check Your Bill
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 text-center">
              Enter your account number to view your current balance and pay instantly.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Input
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full sm:w-80 dark:bg-gray-800"
              />
              <Button
                onClick={handleCheckBill}
                disabled={loading}
                className="px-6 text-base cursor-pointer"
              >
                {loading ? "Checking..." : "Check Bill"}
              </Button>
            </div>

            {error && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
          </div>
          
          {billing && billing.length > 0 && (
            <div className="max-h-[480px] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {billing.map((bill) => (
                <Card key={bill.id} className="bg-white dark:bg-gray-800 text-left">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                      Billing Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p>
                      <span className="font-medium">Client Name:</span>{" "}
                      {bill.client.fullName}
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span>{" "}
                      {bill.client.accountNumber}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span>{" "}
                      {formatDate(bill.dueDate)}
                    </p>
                    <p>
                      <span className="font-medium">Amount Due:</span>{" "}
                      ₱{bill.amount}
                    </p>
                    <div className="pt-4">
                      <Link href={`/checkout/payment/${bill.id}`} target="_blank">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto cursor-pointer"
                        >
                          Pay Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
