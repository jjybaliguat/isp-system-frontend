"use client"

import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink
} from "lucide-react"
import { BillingDataSchema } from "@/types/billing"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { PaymentProof } from "@/redux/fetures/billing-api-slice"
import Link from "next/link"
import Image from "next/image"
import ImageViewer from "../dialogs/image-viewer-dialog"

interface BillingTableProps {
  data: PaymentProof[]
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

export function PaymentsProofTable({
  data,
  pagination,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}: BillingTableProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const totalPages = pagination?.totalPages || 1
  const total = pagination?.total || 0

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
    <>
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Payment Proof</TableHead>
              {/* <TableHead>Remarks</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No payment confirmations found
                </TableCell>
              </TableRow>
            ) : (
              data.map((proof) => (
                <TableRow key={proof.id}>
                  <TableCell className="font-medium">{proof.billing.client.fullName}</TableCell>
                  <TableCell className="font-medium">{proof.billing.invoiceNumber}</TableCell>
                  <TableCell className="font-medium">{proof.billing.period}</TableCell>
                  <TableCell className="text-center">
                    <div
                      onClick={() => setPreviewImage(proof.imageUrl)}
                      className="cursor-pointer group relative w-16 h-16 mx-auto"
                    >
                      <Image
                        src={proof.imageUrl}
                        alt="Payment Proof"
                        fill
                        className="object-cover rounded-lg border"
                        unoptimized
                      />

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg">
                        <span className="text-white text-xs">View</span>
                      </div>
                    </div>
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
    </div>
    <ImageViewer previewImage={previewImage} setPreviewImage={setPreviewImage} />
    </>
  )
}
