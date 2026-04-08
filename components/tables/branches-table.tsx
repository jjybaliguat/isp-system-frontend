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
import { useDeleteProviderMutation, useGetProvidersQuery } from "@/redux/fetures/provider-api-slice"

interface ClientsTableProps {
  searchQuery: string
}

type ColumnKey = "name" | "companyName" | "address" | "email" | "phoneNumber" | "status" | "totalClients"

export function BranchesTable({ searchQuery }: ClientsTableProps) {
  const [deleteProvider, { isLoading: isDeleting }] = useDeleteProviderMutation()
  const [statusFilter, setStatusFilter] = useState<string>("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedClient, setSelectedClient] = useState<ClientDataSchema | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openClientPaymentsDialog, setOpenClientPaymentsDialog] = useState(false)

  const { data, isLoading, isError, error } = useGetProvidersQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: statusFilter
  })

  const providers = data?.data || []
  // console.log(providers)
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])


  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    name: true,
    companyName: true,
    address: true,
    email: true,
    phoneNumber: true,
    status: true,
    totalClients: true
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
      case "INACTIVE":
        return "bg-rose-500/10 text-gray-500 hover:bg-rose-500/20"
      default:
        return ""
    }
  }

const handleDelete = async (providerId: string) => {
    await deleteProvider(providerId)
    toast("Success", {
        description: "Provider deleted successfully",
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
                {["ACTIVE", "INACTIVE"].map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
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
                  checked={columnVisibility.name}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, name: checked })}
                >
                  Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.companyName}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, companyName: checked })}
                >
                  Company Name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.address}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, address: checked })}
                >
                  Address
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.email}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, email: checked })}
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.phoneNumber}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, phoneNumber: checked })}
                >
                  Phone
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.status}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, status: checked })}
                >
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={columnVisibility.totalClients}
                  onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, totalClients: checked })}
                >
                  Total Clients
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columnVisibility.name && <TableHead className="font-medium">Name</TableHead>}
                {columnVisibility.companyName && <TableHead className="font-medium">Company Name</TableHead>}
                {columnVisibility.address && <TableHead className="font-medium">Address</TableHead>}
                {columnVisibility.email && <TableHead className="font-medium">Email</TableHead>}
                {columnVisibility.phoneNumber && <TableHead className="font-medium">Phone Number</TableHead>}
                {columnVisibility.status && <TableHead className="font-medium">Status</TableHead>}
                {columnVisibility.totalClients && <TableHead className="font-medium">Total Clients</TableHead>}
                <TableHead className="font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No Branch found
                  </TableCell>
                </TableRow>
              ) : (
                providers.map((provider) => (
                  <TableRow key={provider.id} className="group">
                    {columnVisibility.name && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{provider.name}</div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.companyName && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{provider.companyName}</span>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.address && (
                      <TableCell className="max-w-[200px]">
                        <div className="truncate text-sm text-muted-foreground">{provider.companyAddress}</div>
                      </TableCell>
                    )}
                    {columnVisibility.email && (
                      <TableCell>
                        <span className="text-center text-sm font-mono text-foreground">{provider.email}</span>
                      </TableCell>
                    )}
                    {columnVisibility.phoneNumber && (
                      <TableCell>
                        <span className="text-sm font-mono text-foreground">{provider.phoneNumber}</span>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(provider.branchStatus!)}>
                          {provider.branchStatus}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.totalClients && (
                      <TableCell>
                        <span className="text-sm font-mono text-foreground">{provider._count.clients}</span>
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
                            {/* <DropdownMenuItem>Send email</DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}
                            <DropdownMenuItem
                              onClick={(e) => e.preventDefault()}
                            >
                              <DeleteConfirmAction
                                title="Delete Confirmation" 
                                message="Are you sure you want to delete this provider? All data related to this branch will also be deleted."
                                triggerButton={<Button variant="destructive" size="sm" className="w-full" disabled={isDeleting}>Delete</Button>}
                                onConfirm={() => handleDelete(provider.id)}
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
    </>
  )
}
