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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner"
import LoadingComponent from "../Loading"
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from "@/redux/fetures/employees-api-slice"
import { EmployeesDataSchema, EmployeeStatus } from "@/types/employees"
import { cn } from "@/lib/utils"
import { EmployeeDetailsDrawer } from "../drawers/employee-details-drawer"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"

interface ClientsTableProps {
  searchQuery: string
}

type ColumnKey = "employee" | "contact" | "address" | "status" | "role" | "team"

export function EmployeesTable({ searchQuery }: ClientsTableProps) {
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeesDataSchema | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { data, isLoading, isError, error } = useGetEmployeesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: statusFilter
  })

  const employees = data?.data || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])


  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    employee: true,
    contact: true,
    address: true,
    status: true,
    role: true,
    team: true
  })

  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter])

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }

 const getStatusBadge = (status: string) => {
      const colorClasses: Record<string, string> = {
        [EmployeeStatus.ACTIVE]: "bg-green-500/15 text-green-600 border border-green-500/30",
        [EmployeeStatus.INACTIVE]: "bg-red-500/15 text-red-600 border border-red-500/30",
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

const handleDelete = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee({id: employeeId})
      toast("Success", {
          description: "Client deleted successfully",
        })
    }
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

    const handleViewDetails = (employee: EmployeesDataSchema) => {
      setSelectedEmployee(employee)
      setIsDrawerOpen(true)
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
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "ACTIVE" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("ACTIVE")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "INACTIVE" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter("INACTIVE")}
            >
              INACTIVE
            </Button>
          </div>

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
                checked={columnVisibility.employee}
                onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, employee: checked })}
              >
                Employee
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
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, status: checked })}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.role}
                onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, role: checked })}
              >
                Role
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.team}
                onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, team: checked })}
              >
                Team
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columnVisibility.employee && <TableHead className="font-medium">Employee</TableHead>}
                {columnVisibility.contact && <TableHead className="font-medium">Contact</TableHead>}
                {columnVisibility.address && <TableHead className="font-medium">Address</TableHead>}
                {columnVisibility.status && <TableHead className="font-medium">Status</TableHead>}
                {columnVisibility.role && <TableHead className="font-medium">Role</TableHead>}
                {columnVisibility.team && <TableHead className="font-medium">Team</TableHead>}
                <TableHead className="font-medium text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id} className="group">
                    {columnVisibility.employee && (
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {employee.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{employee.fullName}</div>
                            <div className="text-xs text-muted-foreground">Email {employee.email}</div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.contact && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{employee.phoneNumber}</span>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {columnVisibility.address && (
                      <TableCell className="max-w-[200px]">
                        <div className="truncate text-sm text-muted-foreground">{employee.address}</div>
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell className="max-w-[200px]">
                        {getStatusBadge(employee.status)}
                      </TableCell>
                    )}
                    {columnVisibility.role && (
                      <TableCell className="max-w-[200px]">
                        {employee.role}
                      </TableCell>
                    )}
                    {columnVisibility.team && (
                      <TableCell className="max-w-[200px]">
                        {employee.team?.name}
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
                            <DropdownMenuItem onClick={() => handleViewDetails(employee)}>View details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DeleteConfirmAction
                                title="Delete Confirmation" 
                                message="Are you sure you want to delete this employee? This can't be undone."
                                triggerButton={<Button variant="destructive" size="sm" className="w-full">Delete</Button>}
                                onConfirm={() => handleDelete(employee.id)}
                              />
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

      {/* Emmployee Details Drawer */}
      <EmployeeDetailsDrawer employee={selectedEmployee} open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  )
}
