"use client"

import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search } from "lucide-react"
import { useGetBillingsQuery } from "@/redux/fetures/billing-api-slice"
import { BillingStatus } from "@/types/billing"
import { BillingTable } from "../tables/billing-table"
import LogsTable from "../tables/logs-table"
import { useGetLogsQuery } from "@/redux/fetures/logs-api-slice"
import LoadingComponent from "../Loading"

export default function LogsTableWrapper() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState("")
  const [debounceSearch, setDebounceSearch] = useState("")
  const [entity, setEntity] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const entities = ["User", "Billing", "Client", "Employee", "Coverage", "Service Plan", "Client Type", "Network", "Mikrotik", "SMS"]

  const { data, isLoading, error } = useGetLogsQuery({
    page,
    limit,
    search: debounceSearch,
    month,
    year,
    entity
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  useEffect(()=> {
    const handler = setTimeout(() => {
      setDebounceSearch(search)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={entity}
          onValueChange={(value) => {
            setEntity(value === "all" ? "" : value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entities.map((entity) => (
              <SelectItem key={entity} value={entity}>
                {entity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={month}
          onValueChange={(value) => {
            setMonth(value === "all" ? "" : value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year}
          onValueChange={(value) => {
            setYear(value === "all" ? "" : value)
            setPage(1)
          }}
        >
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingComponent />
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-destructive">Error loading billings</div>
        </div>
      ) : (
        <LogsTable
          data={data?.data || []}
          pagination={data?.pagination}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={(newLimit) => {
            setLimit(newLimit)
            setPage(1)
          }}
        />
      )}
    </div>
  )
}