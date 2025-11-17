"use client"

import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Printer,
  Trash2,
} from "lucide-react"
import { BillingDataSchema, BillingStatus } from "@/types/billing"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Checkbox } from "../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { BillingDetailsDrawer } from "../drawers/billing-details-drawer"
import { toast } from "sonner"
import { ConfirmPaymentDrawer } from "../drawers/confirm-payment-drawer"
import { useBulkDeleteBillingsMutation, useDeleteBillingMutation, useSendBillingReminderEmailMutation, useSendBillingReminderSmsMutation } from "@/redux/fetures/billing-api-slice"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/formatCurrency"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { formatDate } from "@/utils/formatDate"
import { useReactToPrint } from "react-to-print";
import { InvoicePrint } from "../printables/invoice-print"
import { IconMail, IconMessage } from "@tabler/icons-react"

interface BillingTableProps {
  data: BillingDataSchema[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  currentPage: number
  onPageChange: (page: number) => void
  rowsPerPage: number
  onRowsPerPageChange: (limit: number) => void
}

export function BillingTable({
  data,
  pagination,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: BillingTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState<BillingDataSchema | null>(null)
  const [selectedBillingToPrint, setSelectedBillingToPrint] = useState<BillingDataSchema | null>(null)
  const [deleteBilling] = useDeleteBillingMutation()
  const [bulkDeleteBillings] = useBulkDeleteBillingsMutation()
  const [sendBillingReminderEmail] = useSendBillingReminderEmailMutation()
  const [sendBillingReminderSms] = useSendBillingReminderSmsMutation()

  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSendReminder = async(billingId: string, type: 'Email' | 'Sms') => {
    try {
      switch(type) {
        case "Email":
          await sendBillingReminderEmail(billingId).unwrap()
          toast.success("Email reminder sent successfully")
          break;
        case "Sms":
          await sendBillingReminderSms(billingId).unwrap()
          toast.success("Sms reminder sent successfully")
          break;
      }
    } catch (error: any) {
      toast.error(`Error: ${error.data.message}`)
      console.log(error)
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id])
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id))
    }
  }

  const handleDelete = async (id: string) => {
      try {
        await deleteBilling(id).unwrap()
        toast("Success", {
          description: "Billing deleted successfully",
        })
      } catch (error) {
        toast("Error", {
          description: "Failed to delete billing",
        })
      }
  }

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteBillings(selectedIds).unwrap()
      toast("Success", {
        description: `${selectedIds.length} billing(s) deleted successfully`,
      })
      setSelectedIds([])
    } catch (error) {
      toast("Error", {
        description: "Failed to delete billings",
      })
    }
  }

  const reactToPrintFn = useReactToPrint({ contentRef,
    documentTitle: selectedBilling ? `Invoice-${selectedBilling.invoiceNumber}` : "Invoice",
   });
  
  useEffect(() => {
    if (selectedBillingToPrint && contentRef.current) {
      console.log("printing")
      reactToPrintFn()
      setSelectedBillingToPrint(null);
    }
  }, [selectedBillingToPrint, reactToPrintFn]);


  const getStatusBadge = (status: string) => {
      const colorClasses: Record<string, string> = {
        [BillingStatus.PAID]: "bg-green-500/15 text-green-600 border border-green-500/30",
        [BillingStatus.PENDING]: "bg-yellow-500/15 text-yellow-600 border border-yellow-500/30",
        [BillingStatus.PARTIALLY_PAID]: "bg-orange-500/15 text-orange-600 border border-orange-500/30",
        [BillingStatus.OVERDUE]: "bg-red-500/15 text-red-600 border border-red-500/30",
        [BillingStatus.CANCELLED]: "bg-gray-500/15 text-gray-600 border border-gray-500/30",
      }

      return (
        <Badge
          className={cn(
            "rounded-full font-medium px-3 py-0.5 capitalize",
            colorClasses[status] || "bg-gray-500/15 text-gray-600 border border-gray-500/30"
          )}
        >
          {status.replace(/_/g, " ")}
        </Badge>
    )
  }

  const renderPageNumbers = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (showEllipsisStart) {
        pages.push(1)
        pages.push("ellipsis-start")
      } else {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (showEllipsisEnd) {
        pages.push("ellipsis-end")
        pages.push(totalPages)
      } else {
        for (let i = totalPages - 2; i <= totalPages; i++) {
          if (!pages.includes(i)) {
            pages.push(i)
          }
        }
      }
    }

    return pages.map((page, index) => {
      if (page === "ellipsis-start" || page === "ellipsis-end") {
        return (
          <Button key={`ellipsis-${index}`} variant="ghost" size="sm" disabled>
            ...
          </Button>
        )
      }
      return (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page as number)}
        >
          {page}
        </Button>
      )
    })
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-4">
          <span className="text-sm font-medium">{selectedIds.length} item(s) selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedIds([])}>
            Clear Selection
          </Button>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-12">
                <Checkbox
                  checked={selectedIds.length === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead> */}
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No billings found
                </TableCell>
              </TableRow>
            ) : (
              data.map((billing) => (
                <TableRow key={billing.id}>
                  {/* <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(billing.id)}
                      onCheckedChange={(checked) => handleSelectOne(billing.id, checked as boolean)}
                    />
                  </TableCell> */}
                  <TableCell className="font-medium">{billing.invoiceNumber}</TableCell>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium text-foreground">{billing.client.fullName}</div>
                      <div className="text-xs text-muted-foreground">AccNum: {billing.client.accountNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{billing.period}</TableCell>
                  <TableCell>{formatDate(billing.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(billing.amount)}</TableCell>
                  <TableCell>{formatCurrency(billing.paidAmount)}</TableCell>
                  <TableCell>{getStatusBadge(billing.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBilling(billing)
                            setDetailsDrawerOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {billing.status !== BillingStatus.PAID && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedBilling(billing)
                              setPaymentDrawerOpen(true)
                            }}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Confirm Payment
                          </DropdownMenuItem>
                        )}
                        {billing.status !== BillingStatus.PAID && <DropdownMenuItem
                          onClick={() => handleSendReminder(billing.id, "Email")}
                        >
                          <IconMail />
                          Send Email Reminder
                        </DropdownMenuItem>}
                        {billing.status !== BillingStatus.PAID && <DropdownMenuItem
                          onClick={() => handleSendReminder(billing.id, "Sms")}
                        >
                          <IconMessage />
                          Send SMS Reminder
                        </DropdownMenuItem>}
                        <DropdownMenuItem
                          onClick={() => setSelectedBillingToPrint(billing)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={(e) => e.preventDefault()} className="text-destructive">
                          <DeleteConfirmAction
                            title="Delete Confirmation" 
                            message="Are you sure you want to delete this bill? This can't be undone."
                            triggerButton={<Button variant="destructive" size="sm" className="w-full">Delete</Button>}
                            onConfirm={() => handleDelete(billing.id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {Math.min((currentPage - 1) * rowsPerPage + 1, total)} to{" "}
            {Math.min(currentPage * rowsPerPage, total)} of {total} billings
          </span>
          <Select value={rowsPerPage.toString()} onValueChange={(value) => onRowsPerPageChange(Number.parseInt(value))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden items-center gap-1 sm:flex">{renderPageNumbers()}</div>

          <div className="flex items-center gap-1 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

        {selectedBillingToPrint && 
          <div style={{ display: "none" }}>
          <InvoicePrint ref={contentRef} billing={selectedBillingToPrint!} />
        </div>
        }

      {selectedBilling && (
        <>
          <BillingDetailsDrawer
            billing={selectedBilling}
            open={detailsDrawerOpen}
            onOpenChange={setDetailsDrawerOpen}
          />
          <ConfirmPaymentDrawer
            billing={selectedBilling}
            open={paymentDrawerOpen}
            onOpenChange={setPaymentDrawerOpen}
          />
        </>
      )}
    </div>
  )
}
