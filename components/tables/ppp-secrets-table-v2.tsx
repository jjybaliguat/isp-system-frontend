"use client"
import { PPPSecrets, useGetActivePPPQuery, useGetPPPSecretsQuery, useGetPPPSecretsV2Query, useUpdatedSecretsMutation, useUpdatedSecretsV2Mutation } from '@/redux/fetures/mikrotik-api-slice'
import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft, PlusIcon, MinusIcon, CheckIcon, XIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import LoadingComponent from "../Loading"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import VerifyPassword from '../dialogs/verify-password'

function PPPSecretsTableV2({searchQuery, mikrotikId}: {searchQuery: string, mikrotikId: string}) {
    const [updateSecrets, {isLoading: loadingUpdate}] = useUpdatedSecretsV2Mutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("All")
    const router = useRouter()
    const {data, isLoading, isError, error} = useGetPPPSecretsV2Query({
      mikrotikId,
      page: currentPage,
      limit: itemsPerPage,
      search: searchQuery,
      status: statusFilter
    })

    const secrets = data?.data || []
    const pagination = data?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 }

    useEffect(() => {
      setCurrentPage(1)
    }, [searchQuery])

    useMemo(() => {
      setCurrentPage(1)
    }, [searchQuery])

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

    if (isLoading) {
      return <LoadingComponent />
    }

      if (isError) {
        return (
        <div className="rounded-lg border border-border bg-card p-8">
            <div className="text-center text-destructive">Error loading ppp accounts: {error?.data?.message?.toString()}</div>
        </div>
        )
    }

      const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Number(value))
        setCurrentPage(1)
    }

const handleRowClick = (
    e: React.MouseEvent,
    row: PPPSecrets,
    index: number
  ) => {
    const rowName = row.name;

    if (e.shiftKey && lastSelectedIndex !== null) {
      // SHIFT: range selection
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);

      const range = secrets.slice(start, end + 1).map(r => r.name);

      setSelectedRows(prev => Array.from(new Set([...prev, ...range])));
    } else if (e.ctrlKey || e.metaKey) {
      // CTRL: toggle selection
      setSelectedRows(prev =>
        prev.includes(rowName)
          ? prev.filter(name => name !== rowName)
          : [...prev, rowName]
      );
      setLastSelectedIndex(index);
    } else {
      // Normal click
      setSelectedRows([rowName]);
      setLastSelectedIndex(index);
    }
  };

  const handleUpdate = async(action: "delete" | "enable" | "disable") => {
    if(selectedRows.length == 0) return 
    try {
      await updateSecrets({names: selectedRows, action, mikrotikId})
      toast.success("Successfully updating secret")
    } catch (error) {
      console.log(error)
      toast.error("Error on updating secret")
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-1'>
        <Button
        disabled={loadingUpdate}
        // onClick={()=>handleUpdate("create")} 
        size="icon-lg" variant="secondary" className='hover:bg-primary hover:text-white text-primary'><PlusIcon /></Button>
        <VerifyPassword
          triggerButton={
              <Button
              disabled={loadingUpdate}
              size="icon-lg" variant="secondary" className='hover:bg-destructive hover:text-white text-destructive'><MinusIcon className='h-6 w-6' /></Button>
          }
          onConfirm={()=>handleUpdate("delete")}
        />
        <VerifyPassword
          triggerButton={
            <Button
            disabled={loadingUpdate}
            size="icon-lg" variant="secondary" className='hover:bg-blue-500 hover:text-white text-blue-700'><CheckIcon /></Button>
          }
          onConfirm={()=>handleUpdate("enable")}
        />
        <VerifyPassword
          triggerButton={
            <Button
            disabled={loadingUpdate}
            size="icon-lg" variant="secondary" className='hover:bg-destructive hover:text-white text-destructive'><XIcon /></Button>
          }
          onConfirm={()=>handleUpdate("disable")}
        />
      </div>
      <div className="rounded-lg border border-border bg-card">
          <div className='flex justify-between items-center p-4 border-b border-border'>
            <h1>{pagination.total} items {selectedRows.length > 0 && `(${selectedRows.length} selected)`}</h1>
            <div className="flex flex-wrap justify-end flex-row gap-2 items-center px-6 py-3">
                <Select
                    value={statusFilter}
                    onValueChange={(stat) => setStatusFilter(stat)}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by coverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Status All</SelectItem>
                      {["Enabled", "Disabled"].map((stat) => (
                        <SelectItem key={stat} value={stat}>
                          {stat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Service</TableHead>
                  {/* <TableHead>Caller Id</TableHead> */}
                  <TableHead>Profile</TableHead>
                  <TableHead>Last Logged Out</TableHead>
                  <TableHead>Last Disconnect Reason</TableHead>
                  </TableRow>
              </TableHeader>

              <TableBody>

                  {isLoading && (
                  <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                      Loading sessions...
                      </TableCell>
                  </TableRow>
                  )}

                  {isError && (
                  <TableRow>
                      <TableCell colSpan={3} className="text-center text-red-500 py-6">
                      Failed to load PPP sessions
                      </TableCell>
                  </TableRow>
                  )}

                  {!isLoading && secrets.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={3} className="text-center py-6">
                      No PPP Secrets found
                      </TableCell>
                  </TableRow>
                  )}

                  {secrets.map((row, index)=>{
                    const isSelected = selectedRows.includes(row.name)

                    return (
                      <TableRow
                      key={row.name}
                      className={`cursor-pointer select-none ${isSelected ? "bg-primary text-white" : ""} hover:bg-primary hover:text-white ${row.disabled === "true" ? `${isSelected ? "bg-primary text-slate-400" : "bg-muted text-muted-foreground"}` : ""}`}
                      onDoubleClick={()=>router.push(`/dashboard/ppp/${row.name}`)}
                      onClick={(e) => handleRowClick(e, row, index)}
                  >

                      <TableCell className="font-medium">
                      {row.name}
                      </TableCell>
                      <TableCell>
                      {row.service}
                      </TableCell>
                      <TableCell>
                      {row.profile}
                      </TableCell>
                      <TableCell>
                      {row['last-logged-out']}
                      </TableCell>
                      <TableCell>
                      {row['last-disconnect-reason']}
                      </TableCell>

                      {/* <TableCell>
                      {row['caller-id']}
                      </TableCell> */}
                  </TableRow>
                    )
                  })}

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
    </div>
  )
}

export default PPPSecretsTableV2