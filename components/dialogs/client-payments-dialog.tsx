"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useGetFullYearBillingByIdQuery } from "@/redux/fetures/billing-api-slice";
import { ClientDataSchema } from "@/types/clients";
import { formatDate } from "@/utils/formatDate";
import { ConfirmPaymentDrawer } from "../drawers/confirm-payment-drawer";
import { BillingDataSchema } from "@/types/billing";
import { useSidebar } from "../ui/sidebar";

interface ViewPaymentsProps {
  client: ClientDataSchema | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientPaymentsDialog({
  client,
  open,
  onOpenChange,
}: ViewPaymentsProps) {
  const { isMobile } = useSidebar();

  const { data: billings = [] } = useGetFullYearBillingByIdQuery(client?.id!);

  const [selectedBilling, setSelectedBilling] = useState<BillingDataSchema | null>(null);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);

  const handleSaveComment = () => {
    if (!selectedBilling) return;
    console.log("Saved comment:", selectedBilling.id, comments[selectedBilling.id]);
    setCommentDialogOpen(false);
  };

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const getBillingsForMonth = (monthIndex: number) => {
    return billings.filter(
      (b) => new Date(b.dueDate).getMonth() === monthIndex
    );
  };

  return (
    <>
      {/* MAIN BILLING DISPLAY */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl p-4 sm:p-6 sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>
              {client?.fullName} — {new Date().getFullYear()} Billings
            </DialogTitle>
          </DialogHeader>

          {/* Destop View */}
          {!isMobile && (
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border text-sm text-center">
                <thead>
                  <tr>
                    {months.map((m) => (
                      <th key={m} className="border px-4 py-2 bg-muted font-medium">
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    {months.map((m, i) => {
                      const monthBillings = getBillingsForMonth(i);

                      return (
                        <td key={m} className="border px-2 py-3 align-top min-w-[120px]">
                          {monthBillings.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {monthBillings.map((billing) => (
                                <ContextMenu key={billing.id}>
                                  <ContextMenuTrigger asChild>
                                    <div className="p-2 border rounded-lg shadow-sm cursor-pointer hover:bg-accent transition flex flex-col gap-1">
                                      <p className="font-semibold">
                                        ₱{billing.amount.toFixed(2)}
                                      </p>

                                      <span
                                        className={`px-2 py-1 rounded-full text-xs mx-auto
                                          ${
                                            billing.status === "PAID"
                                              ? "bg-green-200 text-green-800"
                                              : billing.status === "OVERDUE"
                                              ? "bg-red-200 text-red-800"
                                              : "bg-yellow-200 text-yellow-800"
                                          }`}
                                      >
                                        {billing.status}
                                      </span>

                                      {billing.status === "PENDING" && (
                                        <p className="text-xs text-muted-foreground">
                                          Due: {formatDate(billing.dueDate)}
                                        </p>
                                      )}
                                    </div>
                                  </ContextMenuTrigger>

                                  <ContextMenuContent>
                                    {billing.status !== "PAID" && (
                                      <ContextMenuItem
                                        onClick={() => {
                                          setSelectedBilling(billing);
                                          setOpenConfirmPayment(true);
                                        }}
                                      >
                                        Confirm Payment
                                      </ContextMenuItem>
                                    )}
                                    <ContextMenuItem
                                      onClick={() => {
                                        setSelectedBilling(billing);
                                        setCommentDialogOpen(true);
                                      }}
                                    >
                                      Add Comment
                                    </ContextMenuItem>
                                  </ContextMenuContent>
                                </ContextMenu>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No billing</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile View */}
          {isMobile && (
            <div className="mt-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
              {months.map((m, i) => {
                const monthBillings = getBillingsForMonth(i);
                return (
                  <div key={m} className="border rounded-lg p-3 shadow-sm bg-card">
                    <h3 className="font-semibold mb-2 text-sm">{m}</h3>

                    {monthBillings.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {monthBillings.map((billing) => (
                          <ContextMenu key={billing.id}>
                            <ContextMenuTrigger asChild>
                              <div className="p-3 border rounded-lg shadow cursor-pointer hover:bg-accent transition flex flex-col gap-1">
                                <p className="font-semibold">
                                  ₱{billing.amount.toFixed(2)}
                                </p>

                                <span
                                  className={`px-2 py-1 rounded-full text-xs w-fit
                                    ${
                                      billing.status === "PAID"
                                        ? "bg-green-200 text-green-800"
                                        : billing.status === "OVERDUE"
                                        ? "bg-red-200 text-red-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                                >
                                  {billing.status}
                                </span>

                                {billing.status === "PENDING" && (
                                  <p className="text-xs text-muted-foreground">
                                    Due: {formatDate(billing.dueDate)}
                                  </p>
                                )}
                              </div>
                            </ContextMenuTrigger>

                            <ContextMenuContent>
                              {billing.status !== "PAID" && (
                                <ContextMenuItem
                                  onClick={() => {
                                    setSelectedBilling(billing);
                                    setOpenConfirmPayment(true);
                                  }}
                                >
                                  Confirm Payment
                                </ContextMenuItem>
                              )}

                              <ContextMenuItem
                                onClick={() => {
                                  setSelectedBilling(billing);
                                  setCommentDialogOpen(true);
                                }}
                              >
                                Add Comment
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No billing</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DRAWER FOR CONFIRM PAYMENT */}
      <ConfirmPaymentDrawer
        open={openConfirmPayment}
        onOpenChange={setOpenConfirmPayment}
        billing={selectedBilling!}
      />

      {/* COMMENT DIALOG */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>

          <Textarea
            placeholder="Enter comment..."
            value={selectedBilling?.id ? comments[selectedBilling.id] || "" : ""}
            onChange={(e) =>
              setComments((prev) => ({
                ...prev,
                [selectedBilling?.id!]: e.target.value,
              }))
            }
          />

          <div className="flex justify-end mt-3">
            <Button onClick={handleSaveComment}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
