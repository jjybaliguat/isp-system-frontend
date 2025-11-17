import { ClientDataSchema } from "./clients";

export interface BillingData {
  id: string;
  invoiceNumber: string;
  amount: number;
  period?: string;
  status: string;
  dueDate: Date;
  description?: string;
  client: {
    fullName: string;
    accountNumber: string;
  }
}

export type BillType = "Full" | "ThisMonth" | "NextMonth" | "ProRated" | null

export interface BillingDataSchema {
  id: string
  invoiceNumber: string
  client: ClientDataSchema
  billingDate: string
  period: string
  dueDate: string
  amount: number
  paidAmount: number
  status: BillingStatus
  description?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}


export enum BillingStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface PaymentDataSchema {
  id: string
  billingId: string
  amount: number
  clientId?: string
  paymentChannel?: string
  referenceId?: string
  xenditInvoiceId?: string
  paidAt?: string
  recordedBy?: string
  paymentDate: string
  paymentMethod: string
  referenceNumber: string
  receivedBy: string
  status: string
  billing?: BillingDataSchema
  client?: ClientDataSchema
}

export interface CreateBillingInput {
  clientId: string
  period: string
  amount: number
  description?: string,
  dueDate?: string
}

export interface ConfirmPaymentInput {
  billingId: string
  amount: number
  paymentDate: string
  paymentMethod: string
  referenceNumber: string
  sendReceipt?: boolean
}