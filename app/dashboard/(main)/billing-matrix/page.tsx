"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Loader2, Search, Settings2 } from "lucide-react"
import { formatCurrency } from "@/utils/formatCurrency"
import { useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { BillingDataSchema, BillingStatus } from "@/types/billing"
import { getStatusBadge } from "@/components/ui/getBillStatusBadge"
import PageWrapper from "@/components/wrapper/page-wrapper"
import { formatDate } from "@/utils/formatDate"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ConfirmPaymentDrawer } from "@/components/drawers/confirm-payment-drawer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"
import { BillingDetailsDrawer } from "@/components/drawers/billing-details-drawer"
import { withRoleGuard } from "@/lib/withRoleGuard"
import { UserRole } from "@/types/users"
import { useCreateCommentMutation } from "@/redux/fetures/billing-api-slice"
import { toast } from "sonner"

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]

const statusPriority = (s: string) => ({
  OVERDUE: 1,
  PENDING: 2,
  PARTIALLY_PAID: 3,
  PAID: 4,
  CANCELLED: 5
}[s] ?? 6)

const aggStatus = (bills: BillingDataSchema[]) => {
  if (!bills?.length) return "NO_BILL"
  return bills.reduce((worst, b) => (statusPriority(b.status) < statusPriority(worst) ? b.status : worst), "PAID")
}

const DEFAULT_COLUMNS = {
    January: true,
    February: true,
    March: true,
    April: true,
    May: true,
    June: true,
    July: true,
    August: true,
    September: true,
    October: true,
    November: true,
    December: true,
  }

function ClientYearBillingTable() {
  const [createComment] = useCreateCommentMutation()
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [search, setSearch] = useState<string>("")
  const [debounced, setDebounced] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(25)

  const [selectedBilling, setSelectedBilling] = useState<BillingDataSchema | null>(null);
  const [comment, setComment] = useState("")
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [openConfirmPayment, setOpenConfirmPayment] = useState(false);
  const [openViewBilling, setOpenViewBilling] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return DEFAULT_COLUMNS

    try {
      const saved = localStorage.getItem("billing-columns")
      return saved
        ? { ...DEFAULT_COLUMNS, ...JSON.parse(saved) }
        : DEFAULT_COLUMNS
    } catch {
      return DEFAULT_COLUMNS
    }
  })

  useEffect(() => {
    localStorage.setItem(
      "billing-columns",
      JSON.stringify(visibleColumns)
    )
  }, [visibleColumns])


  const { data: clients, isLoading } = useGetClientsQuery({
    search: debounced,
    page,
    limit,
    billingYear: year
  })

  const pagination = clients?.pagination

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 450)
    return () => clearTimeout(t)
  }, [search])

  // Transform clients into rows
 type MonthData = {
  amount: number
  paidAmount: number
  bills: BillingDataSchema[]
  status: string
}

// console.log(selectedBilling)

const rows = useMemo(() => {
  return clients?.data.map((c) => {
    const months: MonthData[] = Array.from({ length: 12 }).map(() => ({ amount: 0, paidAmount: 0, bills: [], status: "NO_BILL" }))

    const accounts = c.accounts?.map((acc) => {
      console.log(acc.billings)
      const billings = (acc.billings?.map((b) => ({
        id: String(b.id),
        invoiceNumber: String(b.invoiceNumber),
        amount: Number(b.amount || 0),
        paidAmount: b.paidAmount ? Number(b.paidAmount) : 0,
        paidAt: b.paidAt? formatDate(b.paidAt!) : undefined,
        status: b.status,
        billingDate: b.billingDate,
        dueDate: b.dueDate,
        period: b.period,
        account: { id: String(acc.id), accountNumber: acc.accountNumber, client: acc.client, billingDay: acc.billingDay, servicePlan: acc.servicePlan },
        discounts: b.discounts || [],
        billingCharges: b.billingCharges || [],
        remarks: b.remarks,
        comments: b.comments,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      })) || []) as BillingDataSchema[]
        for (const bill of billings) {
          const monthIndex = new Date(bill.dueDate).getMonth()
          if (bill.status !== BillingStatus.PAID) {
            months[monthIndex].amount += (bill.amount - bill.paidAmount)
          }
          months[monthIndex].paidAmount += bill.paidAmount
          months[monthIndex].bills.push(bill)
        }
        return { id: String(acc.id), accountNumber: acc.accountNumber, billings }
      }) || []


      months.forEach((m) => { m.status = aggStatus(m.bills) })

      return {
        id: String(c.id),
        fullName: c.fullName,
        accountNumber: c.accountNumber,
        accounts,
        months
      }
    })
  }, [clients])

  const handleSaveComment = async(e: React.FormEvent) => {
    e.preventDefault()
    
    if(!selectedBilling) return
    try {
      await createComment({comment, billingId: selectedBilling?.id})
      setComment("")
      setCommentDialogOpen(false)
      toast.success("Comment added!")
    } catch (error: any) {
      console.log(error)
      toast.error(`Error: ${error.data?.message || error.message}`)
    }
  }

  return (
    <PageWrapper
      pageName="Client and Billings Matrix"
      description="View all clients and their monthly billing status for the selected year. Click on each month to see detailed invoices, payment status, and applied discounts. Use the filters above to search, change year, or adjust the number of rows displayed."
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search client name, account, email, phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>

            <Select value={String(year)} onValueChange={(v) => { setYear(Number(v)); setPage(1) }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }).map((_, i) => {
                  const y = new Date().getFullYear() - i + 1
                  return <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Settings2 className="h-4 w-4" />
                  Columns
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-56 space-y-2">
                <div className="text-sm font-semibold">Toggle Columns</div>
                <div className="border-t pt-2 space-y-1">
                  {MONTH_NAMES.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={visibleColumns[m]}
                        onChange={() =>
                          setVisibleColumns(v => ({ ...v, [m]: !v[m] }))
                        }
                      />
                      {m}
                    </label>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setVisibleColumns(DEFAULT_COLUMNS)}
                >
                  Reset Columns
                </Button>
              </PopoverContent>
            </Popover>
            <div className="text-sm text-muted-foreground">Rows</div>
            <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1) }}>
              <SelectTrigger className="w-20"><SelectValue placeholder="Limit" /></SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => { setSearch(""); setDebounced(""); setPage(1) }}>Reset</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto border rounded-lg shadow-sm max-h-[70vh]">
          <Table className="w-fit table-auto">
            <TableHeader>
              <TableRow className="bg-muted/50 sticky top-0 z-10">
                <TableHead className="px-3 py-2 text-left">Client</TableHead>
                {MONTH_NAMES.map((m) => visibleColumns[m] && (<TableHead key={m} className="px-3 py-2 text-center">{m.slice(0,3)}</TableHead>))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && Array.from({ length: Math.min(limit, 10) }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-3 py-2"><div className="h-4 bg-muted/30 rounded w-40 animate-pulse"/></TableCell>
                  {Array.from({ length: 12 }).map((__, j) => <TableCell key={j} className="px-3 py-2"><div className="h-4 bg-muted/30 rounded w-16 animate-pulse mx-auto"/></TableCell>)}
                </TableRow>
              ))}

              {!isLoading && rows?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} className="px-3 py-6 text-center text-muted-foreground">No clients found.</TableCell>
                </TableRow>
              )}

              {!isLoading && rows?.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/10">
                    <TableCell className="px-3 py-2 align-top">
                      <div className="font-medium">{r.fullName}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.accounts.map((acc) => acc.accountNumber).join(" | ")}
                      </div>
                    </TableCell>

                  {r.months.map((m, mi) => {
                    const monthName = MONTH_NAMES[mi]
                    if (!visibleColumns[monthName]) return null
                    const amountDisplay = m.amount > 0 ? formatCurrency(m.amount) : formatCurrency(m.paidAmount)
                    return (
                      <TableCell key={mi} className="px-3 py-2 align-center text-center">
                        {m.bills.length > 0 ? <Popover>
                          <PopoverTrigger asChild>
                            <button className="w-full flex flex-col items-center gap-1 hover:bg-muted/10 rounded px-1 py-0.5">
                              <div className="text-sm font-medium">{amountDisplay}</div>
                              <div className="mt-1">{getStatusBadge(m.status)}</div>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[320px] space-y-2">
                            <div className="text-sm font-semibold">Month: {MONTH_NAMES[mi]}</div>
                            {m.bills.length === 0 && <div className="text-sm text-muted-foreground">No bills</div>}
                            {m.bills.map((b) => (
                              <ContextMenu key={b.id}>
                                <ContextMenuTrigger asChild>
                                  <div key={b.id} className="p-2 border rounded space-y-1">
                                    <div className="flex justify-between text-sm font-medium">
                                      <div>{b.account?.accountNumber || "Account"}</div>
                                      <div className="text-muted-foreground">{b.invoiceNumber}</div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <div>{formatCurrency(b.amount)}</div>
                                      <div>{getStatusBadge(b.status)}</div>
                                    </div>
                                    {b.paidAt && <div className="flex justify-between items-center text-sm">
                                      <div>Payment Date: </div>
                                      <div>{b.paidAt}</div>
                                    </div>}
                                    {b.discounts?.length > 0 && (
                                      <div className="text-xs text-muted-foreground">
                                        Discounts: {b.discounts.map(d => formatCurrency(d.amount)).join(", ")}
                                      </div>
                                    )}
                                      <div className="max-h-[100px] overflow-y-auto">
                                        {b.comments && b.comments?.length > 0 && b.comments?.map((c)=>(
                                            <p key={c.id} className="text-xs text-muted-foreground">{c.comment} - ({c.user?.fullName})</p>
                                        ))}
                                    </div>
                                  </div>
                                </ContextMenuTrigger>
    
                                <ContextMenuContent>
                                  <ContextMenuItem
                                    onClick={() => {
                                      console.log("View Billing:", b)
                                      setSelectedBilling(b);
                                      setOpenViewBilling(true);
                                    }}
                                  >
                                    View Billing
                                  </ContextMenuItem>
                                  {b.status !== "PAID" && (
                                    <ContextMenuItem
                                      onClick={() => {
                                        console.log(b)
                                        setSelectedBilling(b);
                                        setOpenConfirmPayment(true);
                                      }}
                                    >
                                      Confirm Payment
                                    </ContextMenuItem>
                                  )}
    
                                  <ContextMenuItem
                                    onClick={() => {
                                      setSelectedBilling(b);
                                      setCommentDialogOpen(true);
                                    }}
                                  >
                                    Add Comment
                                  </ContextMenuItem>
                                </ContextMenuContent>
                              </ContextMenu>
                            ))}
                          </PopoverContent>
                        </Popover>  : "—"}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-muted-foreground">
            {pagination ? `Showing page ${pagination.page} of ${Math.ceil(pagination.total / pagination.limit)} (${pagination.total} clients)` : ""}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1 || isLoading}>Prev</Button>
            <div className="px-3">{page}</div>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p+1)} disabled={isLoading || (pagination && page >= Math.ceil(pagination.total / pagination.limit))}>Next</Button>
          </div>
        </div>
      </div>

      {/* DRAWER FOR CONFIRM PAYMENT */}
        <ConfirmPaymentDrawer
          open={openConfirmPayment}
          onOpenChange={setOpenConfirmPayment}
          billing={selectedBilling!}
        />

        <BillingDetailsDrawer
          open={openViewBilling}
          onOpenChange={setOpenViewBilling}
          billing={selectedBilling!}
        />
  
        {/* COMMENT DIALOG */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
  
            <form onSubmit={handleSaveComment}>
              <Textarea
                placeholder="Enter comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
    
              <div className="flex justify-end mt-3">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
    </PageWrapper>
  )
}

export default withRoleGuard(ClientYearBillingTable, {roles: [UserRole.SUPERADMIN, UserRole.ADMIN]})
