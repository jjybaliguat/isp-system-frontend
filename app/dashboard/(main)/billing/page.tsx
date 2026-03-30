"use client"

import { BillingTableWrapper } from "@/components/wrapper/billing-table-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileClock, Plus } from "lucide-react";
import { CreateBillingDialog } from "@/components/dialogs/create-billing-dialog";
import { PaymentsTableWrapper } from "@/components/wrapper/PaymentsTableWrapper";
import PageWrapper from "@/components/wrapper/page-wrapper";
import GenerateBillDialog from "@/components/dialogs/generate-bill-dialog";
import { PaymentsProofTableWrapper } from "@/components/wrapper/payment-proof-table-wrapper";

export default function BillingPage() {
  const [selectedTab, setSelectedTab] = useState('billing')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isGenerateBillDialogOpen, setIsGenerateBillDialogOpen] = useState(false)

  return (
    <PageWrapper
      pageName="Billing"
      description="Manage your billings and payments"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Bill
          </Button>
          <Button onClick={() => setIsGenerateBillDialogOpen(true)}>
            <FileClock className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
        <Tabs
          defaultValue="billing"
          onValueChange={setSelectedTab}
          value={selectedTab}
          className="w-full flex flex-col gap-4 h-full mt-4"
        >
          {/* --- Top Toolbar (Tabs Header + Actions) --- */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Left: View Selector (small screens) */}
            <div className="flex items-center gap-2">
              <Label htmlFor="view-selector" className="sr-only">
                View
              </Label>
              <Select defaultValue="billing" value={selectedTab} onValueChange={setSelectedTab}>
                <SelectTrigger
                  className="flex w-fit @4xl/main:hidden"
                  size="sm"
                  id="view-selector"
                >
                  <SelectValue placeholder="Select a view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="payments">Payments</SelectItem>
                  <SelectItem value="payment-proofs">Payment Proofs</SelectItem>
                </SelectContent>
              </Select>

              {/* Tabs List (visible on large screens) */}
              <TabsList className="hidden @4xl/main:flex">
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="payments">
                  Payments {/*<Badge variant="secondary">2</Badge>*/}
                </TabsTrigger>
                <TabsTrigger value="payment-proofs">
                  Payment Confirmation
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <TabsContent
              value="billing"
              className="flex flex-col gap-4"
            >
              <BillingTableWrapper />
            </TabsContent>

            <TabsContent
              value="payments"
              className="flex flex-col flex-1"
            >
              <PaymentsTableWrapper />
            </TabsContent>
            <TabsContent
              value="payment-proofs"
              className="flex flex-col flex-1"
            >
              <PaymentsProofTableWrapper />
            </TabsContent>
          </div>
        </Tabs>
        <CreateBillingDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        <GenerateBillDialog open={isGenerateBillDialogOpen} onOpenChange={setIsGenerateBillDialogOpen} />
      </div>
    </PageWrapper>
  )
}
