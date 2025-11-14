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
import { MoreHorizontal, Settings2} from "lucide-react"
import { toast } from "sonner"
import LoadingComponent from "../Loading"
import { cn } from "@/lib/utils"
import DeleteConfirmAction from "../dialogs/confirmation-dialog"
import { UsersDataSchema } from "@/types/users"
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/fetures/users-api-slice"

interface ClientsTableProps {
  searchQuery: string
}

type ColumnKey = "role" | "name"

export function UsersTable({ searchQuery }: ClientsTableProps) {
  const [selectedUser, setSelecteduser] = useState<UsersDataSchema | null>(null)
  const {data: users, isLoading, isError, error} = useGetUsersQuery({
    searchQuery
  })
  const [deleteUser, {isLoading: deleting}] = useDeleteUserMutation()


  const [columnVisibility, setColumnVisibility] = useState<Record<ColumnKey, boolean>>({
    role: true,
    name: true
  })


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
                                    triggerButton={<Button disabled={(user.role === "SUPERADMIN" && !user.employeeId)} variant="destructive" size="sm" className="w-full">Delete</Button>}
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
        </div>

    </>
  )
}
