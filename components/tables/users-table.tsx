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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Settings2} from "lucide-react"
import { toast } from "sonner"
import LoadingComponent from "../Loading"
import { cn } from "@/lib/utils"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { UserRole, UsersDataSchema } from "@/types/users"
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/fetures/users-api-slice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface ClientsTableProps {
  searchQuery: string
}

type ColumnKey = "role" | "name"

export function UsersTable({ searchQuery }: ClientsTableProps) {
  const [selectedUser, setSelecteduser] = useState<UsersDataSchema | null>(null)
  const [roleFilter , setRoleFilter] = useState<string>("All")
  const {data, isLoading, isError, error} = useGetUsersQuery({
    searchQuery,
    roleFilter
  })
  const [deleteUser, {isLoading: deleting}] = useDeleteUserMutation()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    role: true,
    name: true
  })

  const users = data?.data || []
  const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

  useEffect(() => {
      setCurrentPage(1)
    }, [searchQuery, roleFilter])

    useMemo(() => {
        setCurrentPage(1)
    }, [searchQuery, roleFilter])

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
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

  const handleDelete = async(id: string) => {
    try {
        await deleteUser(id).unwrap()
        toast.success("User deleted")
    } catch (error) {
        console.log(error)
        toast.error("Error deleting user")
    }
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="text-center text-destructive">Error loading users: {error?.toString()}</div>
      </div>
    )
  }

  return (
    <>
        <div className="rounded-lg border border-border bg-card">
            <div className="flex justify-end border-b border-border px-6 py-3">
                <div className="flex items-center gap-2">
                    <Select
                        value={roleFilter}
                        onValueChange={(value) => setRoleFilter(value)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Roles</SelectItem>
                            {Object.values(UserRole).map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
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
                            checked={columnVisibility.role}
                            onCheckedChange={(checked) => setColumnVisibility({ ...columnVisibility, role: checked })}
                        >
                            Role
                        </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow className="hover:bg-transparent">
                    {columnVisibility.name && <TableHead className="font-medium">Name</TableHead>}
                    {columnVisibility.role && <TableHead className="font-medium">Role</TableHead>}
                    <TableHead className="font-medium text-center">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {users?.length === 0 ? (
                    <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        No Users found
                    </TableCell>
                    </TableRow>
                ) : (
                    users?.map((user) => (
                    <TableRow key={user.id} className="group">
                        {columnVisibility.name && (
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {user.employee?.fullName.charAt(0).toUpperCase() || user.fullName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-medium text-foreground">{user.fullName || user.employee?.fullName}</div>
                                <div className="text-xs text-muted-foreground">Email {user.email}</div>
                            </div>
                            </div>
                        </TableCell>
                        )}
                        {columnVisibility.role && (
                        <TableCell className="max-w-[200px]">
                            {user.role}
                        </TableCell>
                        )}
                        <TableCell>
                        <div className="flex justify-center">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DeleteConfirmAction
                                    title="Delete Confirmation" 
                                    message="Are you sure you want to delete this user? This can't be undone."
                                    triggerButton={<Button disabled={(user.role === "SUPERADMIN" && !user.employeeId && deleting)} variant="destructive" size="sm" className="w-full">Delete</Button>}
                                    onConfirm={() => handleDelete(user.id)}
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

    </>
  )
}
