"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Mail, Phone, ChevronLeft, ChevronRight, Settings2, ChevronsRight, ChevronsLeft } from "lucide-react"
import { useDeleteClientMutation, useGetClientsQuery } from "@/redux/fetures/clientApiSlice"
import { formatCurrency } from "@/utils/formatCurrency"
import { ClientDataSchema } from "@/types/clients"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { ClientDetailsDrawer } from "../drawers/client-details-drawer"
import { toast } from "sonner"
import LoadingComponent from "../Loading"
import ClientPaymentsDialog from "../dialogs/client-payments-dialog"
import { useGetCoverageQuery } from "@/redux/fetures/converage-api-slice"
import { CoverageDataSchema } from "@/types/coverage"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import GenerateSoaDialog from "../dialogs/generate-soa-dialog"

interface ClientsTableProps {
  searchQuery: string
}

type ColumnKey = "client" | "contact" | "address" | "servicePlan" | "billingDay" | "clientType" | "status" | "billPerMonth" | "coverage"

export function ClientsTable({ searchQuery }: ClientsTableProps) {
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation()
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedClient, setSelectedClient] = useState<ClientDataSchema | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openClientPaymentsDialog, setOpenClientPaymentsDialog] = useState(false)
  const [selectedCoverage, setSelectedCoverage] = useState<CoverageDataSchema | null>(null)
  const [openGenerateSoaDialog, setOpenGenerateSoaDialog] = useState({
    open: false,
    client: null as ClientDataSchema | null,
  })

  const {data: coverage} = useGetCoverageQuery()

  const { data, isLoading, isError, error } = useGetClientsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: statusFilter,
    coverageId: selectedCoverage?.id
  })

  const clients = data?.data || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])


  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    client: true,
    contact: true,
    address: true,
    servicePlan: true,
    billingDay: true,
    clientType: true,
    status: true,
    coverage: true,
    billPerMonth: true,
  })

  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "TERMINATED":
        return "bg-rose-500/10 text-gray-500 hover:bg-rose-500/20"
      case "PARTIALLY_DISCONNECTED":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return ""
    }
  }

const handleDelete = async (clientId: string) => {
    await deleteClient({id: clientId})
    toast("Success", {
        description: "Client deleted successfully",
      })
  }

const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    const totalPages = pagination.totalPages

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        end = Math.min(maxVisible - 1, totalPages - 1)
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisible - 2))
      }

      if (start > 2) {
        pages.push("...")
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) {
        pages.push("...")
      }

      pages.push(totalPages)
    }

    return pages
  }

    const handleViewDetails = (client: ClientDataSchema) => {
      setSelectedClient(client)
      setIsDrawerOpen(true)
    }

    const handleViewPayments= (client: ClientDataSchema) => {
        setSelectedClient(client)
        setOpenClientPaymentsDialog(true)
    }


  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="text-center text-destructive">Error loading clients: {error?.toString()}</div>
      </div>
    )
  }

  return (
    <>
    <div className="rounded-lg border border-border bg-card">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-end flex-row gap-2 items-center border-b border-border px-6 py-3">
          <Select
              value={statusFilter}
              onValueChange={(stat) => setStatusFilter(stat)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by coverage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {["ACTIVE", "TERMINATED", "PARTIALLY_DISCONNECTED"].map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
          </Select>

            <Select
              value={selectedCoverage?.id?.toString() ?? "All"}
              onValueChange={(value) => {
                if (value === "All") {
                  setSelectedCoverage(null);
                } else {
                  const selected = coverage?.find((area) => area.id.toString() === value);
                  setSelectedCoverage(selected || null);
                }
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by coverage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Coverage</SelectItem>
                {coverage?.map((area) => (
                  <SelectItem key={area.id} value={area.id.toString()}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Settings2 className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.client}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, client: checked })}
                >
                  Client
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.contact}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, contact: checked })}
                >
                  Contact
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.address}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, address: checked })}
                >
                  Address
                </DropdownMenuCheckboxItem>
                {/* <DropdownMenuCheckboxItem
                  checked={columnVisibility.servicePlan}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, servicePlan: checked })}
                >
                  Service Plan
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.billingDay}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, billingDay: checked })}
                >
                  Billing Day
                </DropdownMenuCheckboxItem> */}
                {/* <DropdownMenuCheckboxItem
                  checked={columnVisibility.clientType}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, clientType: checked })}
                >
                  Client Type
                </DropdownMenuCheckboxItem> */}
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.coverage}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, coverage: checked })}
                >
                  Coverage
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.status}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, status: checked })}
                >
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.billPerMonth}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, billPerMonth: checked })}
                >
                  Bill/Month
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columnVisibility.client && <TableHead className="font-medium">Client</TableHead>}
                {columnVisibility.contact && <TableHead className="font-medium">Contact</TableHead>}
                {columnVisibility.address && <TableHead className="font-medium">Address</TableHead>}
                {/* {columnVisibility.servicePlan && <TableHead className="font-medium">Service Plan</TableHead>}
                {columnVisibility.billingDay && <TableHead className="font-medium">Billing Day</TableHead>}
                {columnVisibility.clientType && <TableHead className="font-medium">Client Type</TableHead>} */}
                {columnVisibility.status && <TableHead className="font-medium">Status</TableHead>}
                {columnVisibility.status && <TableHead className="font-medium text-center">Coverage</TableHead>}
                {columnVisibility.billPerMonth && <TableHead className="font-medium text-right">Bill/Month</TableHead>}
                <TableHead className="font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow key={client.id} className="group">
                    {columnVisibility.client && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {client.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{client.fullName}</div>
                            <div className="text-xs text-muted-foreground">
                              ACC: {client.accounts?.length
                                ? client.accounts.map(a => a.accountNumber).join(", ")
                                : "-"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.contact && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.phoneNumber}</span>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.address && (
                      <TableCell className="max-w-[200px]">
                        <div className="truncate text-sm text-muted-foreground">{client.address}</div>
                      </TableCell>
                    )}
                    {/* {columnVisibility.servicePlan && (
                      <TableCell>
                        <span className="text-sm font-mono text-foreground">{client.servicePlan?.name}</span>
                      </TableCell>
                    )}
                    {columnVisibility.billingDay && (
                      <TableCell>
                        <span className="text-sm font-mono text-foreground">{client.billingDay}</span>
                      </TableCell>
                    )}
                    {columnVisibility.clientType && (
                      <TableCell>
                        <span className="text-sm font-mono text-foreground">{client.clientType?.name}</span>
                      </TableCell>
                    )} */}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.coverage && (
                      <TableCell className="text-center">
                        <span className="text-center text-sm font-mono text-foreground">{client.coverage?.name || "--"}</span>
                      </TableCell>
                    )}
                    {columnVisibility.billPerMonth && (
                      <TableCell className="text-right font-medium">
                        {client.accounts
                          ?.map(acc => formatCurrency(acc.servicePlan?.monthlyFee) ?? "—")
                          .join(" | ")}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleViewDetails(client)}>View details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewPayments(client)}>View Billings</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenGenerateSoaDialog({ open: true, client })}>Generate SOA</DropdownMenuItem>
                            {/* <DropdownMenuItem>Send email</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => e.preventDefault()}
                            >
                              <DeleteConfirmAction
                                title="Delete Confirmation" 
                                message="Are you sure you want to delete this client? This can't be undone."
                                triggerButton={<Button variant="destructive" size="sm" className="w-full">Delete</Button>}
                                onConfirm={() => handleDelete(client.id)}
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total > 0 && (
          <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} clients
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
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
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* Mobile: Simple prev/next with page info */}
              <div className="flex items-center gap-2 sm:hidden">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop: Full pagination with page numbers */}
              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) =>
                    typeof page === "number" ? (
                      <Button
                        key={index}
                        variant={currentPage === page ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ) : (
                      <span key={index} className="px-2 text-muted-foreground">
                        {page}
                      </span>
                    ),
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="h-8 px-3"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client Details Drawer */}
      <ClientDetailsDrawer client={selectedClient} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
      <ClientPaymentsDialog client={selectedClient} open={openClientPaymentsDialog} onOpenChange={setOpenClientPaymentsDialog} />
      <GenerateSoaDialog open={openGenerateSoaDialog.open} onOpenChange={(open) => setOpenGenerateSoaDialog({...openGenerateSoaDialog, open})} client={openGenerateSoaDialog.client} />
    </>
  )
}
