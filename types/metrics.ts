export interface DashboardMetrics {
  revenue: RevenueMetrics
  billing: BillingMetrics
  accountsReceivable: ARMetrics
  paymentMethods: PaymentMethodMetrics
  discounts: DiscountMetrics
  customerMetrics: CustomerMetrics
  alerts: AlertMetrics
}

export interface RevenueMetrics {
  totalMonthly: number
  totalYTD: number
  byServiceType: { name: string; value: number }[]
  trend: { month: string; revenue: number }[]
  averagePerClient: number
}

export interface BillingMetrics {
  totalInvoices: number
  paid: number
  pending: number,
  overdue: number
  overdueClients: { name: string; amount: number; daysOverdue: number }[]
  partialPayments: number
}

export interface ARMetrics {
  totalOutstanding: number
  aging: { range: string; amount: number; count: number }[]
  topDebtors: { name: string; amount: number; accountNumber: string }[]
}

export interface PaymentMethodMetrics {
  breakdown: { method: string; amount: number; count: number }[]
  collectionsTrend: { month: string; amount: number }[]
  failedTransactions: number
}

export interface DiscountMetrics {
  totalDiscounts: number
  refunds: { amount: number; count: number; reasons: { reason: string; count: number }[] }
  writeOffs: number
}

export interface CustomerMetrics {
  lifetimeValue: number
  churnedWithBalance: { count: number; totalBalance: number }
  newVsReturning: { month: string; new: number; returning: number }[]
}

export interface AlertMetrics {
  revenueTarget: { actual: number; target: number; variance: number }
  arThreshold: { current: number; threshold: number; exceeded: boolean }
  topOverdueClients: { name: string; amount: number; days: number }[]
  pendingRefunds: number
}