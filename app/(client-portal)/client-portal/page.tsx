"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetDashboardQuery } from "@/redux/fetures/clientApiSlice"
import { Skeleton } from "@/components/ui/skeleton"
import { FiCreditCard, FiCalendar, FiAlertCircle, FiActivity } from "react-icons/fi"
import Link from "next/link"

export default function ClientDashboard() {
  const { data, isLoading, isFetching } = useGetDashboardQuery()
  const loading = isLoading || isFetching

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Map through accounts */}
      {loading ? (
        Array.from({ length: 2 }).map((_, i) => (
          <AccountCardSkeleton key={i} />
        ))
      ) : (
        data?.accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))
      )}
    </div>
  )
}

// Render card for each account
function AccountCard({ account } : {account: any}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Account: {account.accountNumber}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Plan"
          value={account.activePlan}
          icon={<FiActivity className="text-indigo-500 w-6 h-6" />}
        />
        <StatCard
          title="Next Due Date"
          value={account.nextDueDate}
          icon={<FiCalendar className="text-green-500 w-6 h-6" />}
          action={`/client-portal/billing?account=${account.id}`}
        />
        <StatCard
          title="Outstanding Balance"
          value={account.outstandingBalance.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
          icon={<FiCreditCard className="text-red-500 w-6 h-6" />}
        />
        <StatCard
          title="Service Status"
          value={account.serviceStatus}
          icon={<FiAlertCircle className="text-yellow-500 w-6 h-6" />}
        />
      </div>
    </div>
  )
}

// Individual stat card
function StatCard({
  title,
  value,
  icon,
  action,
}: {
  title: string
  value?: string
  icon: React.ReactNode
  action?: string
}) {
  return (
    <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 flex flex-col gap-1">
        <CardHeader className="p-0">
          <CardTitle className="text-sm text-gray-500 dark:text-gray-400">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {value ?? <Skeleton className="h-6 w-24 rounded-md" />}
        </CardContent>
        {action && (
          <Link href={action} className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View Billing
          </Link>
        )}
      </div>
    </Card>
  )
}

// Skeleton for loading multiple accounts
function AccountCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-6 w-1/2 rounded-md" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl shadow-md">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 flex flex-col gap-1">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-6 w-32 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
