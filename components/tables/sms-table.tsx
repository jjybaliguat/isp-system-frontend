"use client"

import { useState } from "react"
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
import { useBulkDeleteBillingsMutation, useDeleteBillingMutation } from "@/redux/fetures/billing-api-slice"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/formatCurrency"
import { SmsDataSchema, SmsStatus } from "@/types/sms"
import { formatDate } from "@/utils/formatDate"
import { formatDateTime, formatLocalDateTime } from "@/utils/formatDateTime"

interface SmsTableProps {
  data: SmsDataSchema[]
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

export function SmsTable({
  data,
  pagination,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: SmsTableProps) {
  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0

  const getStatusBadge = (status: string) => {
      const colorClasses: Record<string, string> = {
        [SmsStatus.Sent]: "bg-green-500/15 text-green-600 border border-green-500/30",
        [SmsStatus.Pending]: "bg-yellow-500/15 text-yellow-600 border border-yellow-500/30",
        [SmsStatus.Failed]: "bg-red-500/15 text-red-600 border border-red-500/30"
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

  if(!data){
    return <h1>Error loading messages</h1>
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Message Id</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Sender Name</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              data?.map((sms) => (
                <TableRow key={sms.message_id}>
                  <TableCell className="font-medium">{sms.message_id}</TableCell>
                  <TableCell className="font-medium">{sms.recipient}</TableCell>
                  <TableCell>{sms.message}</TableCell>
                  <TableCell>{sms.sender_name}</TableCell>
                  <TableCell>{sms.network}</TableCell>
                  <TableCell>{getStatusBadge(sms.status)}</TableCell>
                  <TableCell>{sms.type}</TableCell>
                  <TableCell>{formatLocalDateTime(sms.created_at)}</TableCell>
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
            {Math.min(currentPage * rowsPerPage, total)} of {total} messages
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

        {/* <div className="flex flex-wrap items-center gap-2">
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
        </div> */}
      </div>
    </div>
  )
}
