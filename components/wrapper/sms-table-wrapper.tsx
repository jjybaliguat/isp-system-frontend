"use client"

import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Search } from "lucide-react"
import { useGetBillingsQuery } from "@/redux/fetures/billing-api-slice"
import { BillingStatus } from "@/types/billing"
import { BillingTable } from "../tables/billing-table"
import { useGetSmsQuery } from "@/redux/fetures/sms-api-slice"
import LoadingComponent from "../Loading"
import { SmsTable } from "../tables/sms-table"

export function SmsTableWrapper() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data, isLoading, error } = useGetSmsQuery({
    page,
    limit
  })

  const detectKey: any = data?.data
  const apiKeyError = detectKey?.apikey

  return (
    <div className="space-y-4">
      {isLoading ? (
        <LoadingComponent />
      ) : (error || apiKeyError) ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-destructive">{apiKeyError? `${apiKeyError[0]}` : "Error loading messages"}</div>
        </div>
      ) : (
        <SmsTable
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
