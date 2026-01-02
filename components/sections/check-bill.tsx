"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import Link from "next/link";
import { BillingData } from "@/types/billing";
import { Badge } from "../ui/badge";

const statusStyles = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  OVERDUE: "bg-red-500/10 text-red-600 border-red-500/20",
  PARTIALLY_PAID: "bg-blue-500/10 text-blue-600 border-blue-500/20",
}

export default function CheckBillSection() {
  const [accountNumber, setAccountNumber] = useState("");
  const [billing, setBilling] = useState<BillingData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckBill = async () => {
    setError("");
    setBilling(null);

    if (!accountNumber.trim()) {
      setError("Please enter a valid account number.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/billing/get-bills/${accountNumber}`
      );
      if (!res.ok) throw new Error("No billing records found.");
      const data = await res.json();
      setBilling(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="bill"
      className="relative py-24 bg-muted/60 dark:bg-background"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`grid gap-10 transition-all duration-300 ${
            billing && billing.length > 0
              ? "lg:grid-cols-[420px_1fr]"
              : "grid-cols-1"
          }`}
        >
          {/* LEFT PANEL */}
          <Card className="flex flex-col justify-center border bg-background shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold">
                Check Your Bill
              </CardTitle>
              <CardDescription className="mt-2">
                View your current balance and pay securely online
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Input
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="h-11"
              />

              <Button
                onClick={handleCheckBill}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Checking Account..." : "Check Bill"}
              </Button>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Need help? Contact our billing support.
              </p>
            </CardContent>
          </Card>

           {/* RIGHT – BILL RESULTS */}
          {billing && billing.length > 0 && (
            <div className="max-h-[520px] overflow-y-auto space-y-6 pr-2">
              {billing.map((bill) => (
                <Card
                  key={bill.id}
                  className="border bg-background shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">
                      Billing Statement
                    </CardTitle>

                    <Badge
                      variant="outline"
                      className={statusStyles[bill.status as keyof typeof statusStyles]}
                    >
                      {bill.status.replace("_", " ")}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Client Name
                      </span>
                      <span className="font-medium">
                        {bill.client.fullName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Account Number
                      </span>
                      <span>
                        {bill.client.accountNumber}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Due Date
                      </span>
                      <span>
                        {formatDate(bill.dueDate)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-semibold pt-2">
                      <span>Amount Due</span>
                      <span>₱{bill.amount}</span>
                    </div>

                    <div className="pt-4">
                      <Link
                        href={`/checkout/payment/${bill.id}`}
                        target="_blank"
                      >
                        <Button size="lg" className="w-full">
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
