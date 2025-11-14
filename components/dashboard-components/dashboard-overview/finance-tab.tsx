"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, DollarSign, FileText, Users, AlertTriangle } from "lucide-react"
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
  BarChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useGetFinanceMetricsQuery } from "@/redux/fetures/analytics-api-slice"
import { formatCurrency } from "@/utils/formatCurrency"

export function FinanceTab() {
  const { data: metrics, isLoading, error } = useGetFinanceMetricsQuery()

  if (isLoading) {
    return <FinanceLoadingSkeleton />
  }

  if (error || !metrics) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load finance data. Please try again later.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { revenue, billing, accountsReceivable, paymentMethods, discounts, customerMetrics, alerts } = metrics

  // Color scheme
  const COLORS = {
    paid: "hsl(142, 76%, 36%)", // green
    pending: "hsl(0, 84%, 60%)", // red
    partial: "hsl(48, 96%, 53%)", // yellow
    overdue: "hsl(0, 84%, 60%)", // red
    primary: "hsl(180, 100%, 50%)", // cyan
    secondary: "hsl(0, 0%, 60%)", // gray
  }

  const billingStatusData = [
    { name: "Paid", value: billing?.paid, color: COLORS.paid },
    { name: "Pending", value: billing?.pending, color: COLORS.pending },
    { name: "Partially Paid", value: billing?.partialPayments, color: COLORS.partial },
    { name: "Overdue", value: billing?.overdue, color: COLORS.overdue },
  ]

  return (
    <div className="container mx-auto space-y-6">
      {/* Alerts & KPI Highlights */}
      {(alerts?.revenueTarget?.variance < 0 || alerts?.arThreshold?.exceeded || alerts?.pendingRefunds > 0) && (
        <div className="grid gap-4 md:grid-cols-3">
          {alerts?.revenueTarget.variance < 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Revenue below target by {formatCurrency(Math.abs(alerts?.revenueTarget.variance))}
              </AlertDescription>
            </Alert>
          )}
          {alerts?.arThreshold?.exceeded && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                AR outstanding ({formatCurrency(alerts?.arThreshold?.current)}) exceeds threshold
              </AlertDescription>
            </Alert>
          )}
          {alerts?.pendingRefunds > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{alerts?.pendingRefunds} pending refunds require attention</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Revenue Overview KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue?.totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue?.totalYTD)}</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Client</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenue?.averagePerClient)}</div>
            <p className="text-xs text-muted-foreground">Per client</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billing?.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend & Service Type Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 12 Months)</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: COLORS.primary,
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue?.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Type</CardTitle>
            <CardDescription>Distribution across service plans</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                value: {
                  label: "Revenue",
                  color: COLORS.primary,
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenue?.byServiceType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenue?.byServiceType?.map((entry: any, index: any) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${180 + index * 40}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Billing & Payments */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Billing Status</CardTitle>
            <CardDescription>Paid vs Pending vs Overdue</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                value: {
                  label: "Count",
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={billingStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {billingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Overdue Clients</CardTitle>
            <CardDescription>Clients with outstanding payments</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Days</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billing?.overdueClients.slice(0, 5).map((client: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="text-right text-red-500">{formatCurrency(client.amount)}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{client.daysOverdue}d</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Receivable */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AR Aging Report</CardTitle>
            <CardDescription>(Accounts Receivable) Outstanding balances by age</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: COLORS.primary,
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountsReceivable?.aging}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Debtors</CardTitle>
            <CardDescription>Clients with highest outstanding balance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="mb-4">
              <div className="text-2xl font-bold">{formatCurrency(accountsReceivable?.totalOutstanding)}</div>
              <p className="text-xs text-muted-foreground">Total AR Outstanding</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accountsReceivable?.topDebtors?.slice(0, 5).map((debtor: any, index: any) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{debtor?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{debtor?.accountNumber}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(debtor?.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods & Collections */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Breakdown</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: COLORS.primary,
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethods?.breakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="method" type="category" stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections Trend</CardTitle>
            <CardDescription>Monthly payment collections</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                amount: {
                  label: "Collections",
                  color: COLORS.paid,
                },
              }}
              className="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={paymentMethods?.collectionsTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="amount" stroke={COLORS.paid} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Discounts, Refunds & Customer Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Discounts & Adjustments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(discounts?.totalDiscounts)}</div>
              <p className="text-xs text-muted-foreground">Total Discounts</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(discounts?.refunds?.amount)}</div>
              <p className="text-xs text-muted-foreground">{discounts?.refunds?.count} Refunds</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{discounts?.writeOffs?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Write-offs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(customerMetrics?.lifetimeValue)}</div>
              <p className="text-xs text-muted-foreground">Avg Lifetime Value</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{customerMetrics?.churnedWithBalance?.count}</div>
              <p className="text-xs text-muted-foreground">
                Terminated Accounts (Unpaid Balance) ({formatCurrency(customerMetrics?.churnedWithBalance?.totalBalance)})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{paymentMethods?.failedTransactions}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* New vs Returning Clients Billing Trend */}
      <Card>
        <CardHeader>
          <CardTitle>New vs Returning Clients Billing Trend</CardTitle>
          <CardDescription>Monthly comparison of client billing patterns</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer
            config={{
              new: {
                label: "New Clients",
                color: COLORS.primary,
              },
              returning: {
                label: "Returning Clients",
                color: COLORS.paid,
              },
            }}
            className="h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerMetrics?.newVsReturning}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="new" stroke={COLORS.primary} strokeWidth={2} name="New Clients" />
                <Line
                  type="monotone"
                  dataKey="returning"
                  stroke={COLORS.paid}
                  strokeWidth={2}
                  name="Returning Clients"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function FinanceLoadingSkeleton() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
