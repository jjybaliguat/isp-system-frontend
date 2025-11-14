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
  const { data: billings } = useGetFullYearBillingByIdQuery(client?.id!);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const handleSaveComment = async () => {
    if (!selectedMonth) return;
    console.log("Saved comment:", selectedMonth, comments[selectedMonth]);
    setCommentDialogOpen(false);
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getBillingForMonth = (monthIndex: number) => {
    return billings?.find((b) => new Date(b.dueDate).getMonth() === monthIndex);
  };

  return (
    <>
      {/* Main dialog for viewing billings */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
              className="max-h-[90vh] h-auto overflow-y-auto sm:max-w-[500px] 
              p-4 sm:p-6 rounded-xl"
          >
          <DialogHeader>
            <DialogTitle>
              {client?.fullName} — {new Date().getFullYear()} Billings
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border text-sm text-center">
              <thead>
                <tr>
                  {months.map((m) => (
                    <th key={m} className="border px-4 py-2 bg-muted">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {months.map((m, i) => {
                    const billing: any = getBillingForMonth(i);
                    const payment = billing?.payments?.[0];

                    return (
                      <td key={m} className="border px-4 py-3">
                        {billing ? (
                          <ContextMenu>
                            <ContextMenuTrigger asChild>
                              <div className="flex flex-col items-center gap-1 cursor-context-menu">
                                <p>₱{billing.amount.toFixed(2)}</p>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    billing.status === "PAID"
                                      ? "bg-green-200 text-green-800"
                                      : billing.status === "OVERDUE"
                                      ? "bg-red-200 text-red-800"
                                      : "bg-yellow-200 text-yellow-800"
                                  }`}
                                >
                                  {billing.status}
                                </span>
                                {payment?.paidAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Paid{" "}
                                    {formatDate(payment.paidAt)}
                                  </p>
                                )}
                              </div>
                            </ContextMenuTrigger>

                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() => {
                                  setSelectedMonth(m);
                                  setCommentDialogOpen(true);
                                }}
                              >
                                Add Comment
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        ) : (
                          <span className="text-gray-400 italic">
                            No billing
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Comment dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Comment — {selectedMonth}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter comment..."
            value={selectedMonth ? comments[selectedMonth] || "" : ""}
            onChange={(e) =>
              setComments((prev) => ({
                ...prev,
                [selectedMonth!]: e.target.value,
              }))
            }
            className="mt-2"
          />
          <div className="flex justify-end mt-3">
            <Button onClick={handleSaveComment}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
