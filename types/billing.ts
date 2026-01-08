import { Accounts, ClientDataSchema } from "./clients";

export interface BillingData {
  id: string;
  invoiceNumber: string;
  amount: number;
  period?: string;
  status: string;
  dueDate: Date;
  description?: string;
  billingType?: BillingType;
  billingCharges?: BillingCharges[];
  remarks?: string;
  client: {
    fullName: string;
    accountNumber: string;
  }
}

interface BillingCharges {
  id?: string;
  name: string;
  description: string | null;
  amount: number;
}

enum BillingType {
  REGULAR = "REGULAR",
  PRORATED = "PRORATED",
  INSTALLATION_FEE = "INSTALLATION_FEE",
  LATE_FEE = "LATE_FEE"
}

export type BillType = "Full" | "ThisMonth" | "NextMonth" | "ProRated" | null

export interface BillingDataSchema {
  id: string
  invoiceNumber: string
  client: ClientDataSchema
  account?: Accounts
  billingDate: string
  period: string
  dueDate: string
  amount: number
  paidAmount: number
  billingType?: BillingType;
  billingCharges?: BillingCharges[];
  paidAt?: string
  remarks?: string;
  status: BillingStatus
  description?: string,
  discounts: Discounts[]
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
  account?: Accounts
}

export interface CreateBillingInput {
  clientId: string
  period: string
  amount: number
  description?: string,
  dueDate?: string
}
export interface CreateBillingForAccountInput {
  accountId: string
  period: string
  amount: number
  billingType?: BillingType;
  remarks?: string | null;
  billingCharges?: BillingCharges[];
  description?: string,
  dueDate?: string
  discounts?: Discounts[]
}

interface Discounts {
  id?: string;
  description: string | null;
  amount: number
}

export interface ConfirmPaymentInput {
  billingId: string
  amount: number
  paymentDate: string
  paymentMethod: string
  referenceNumber: string
  sendReceipt?: boolean
}