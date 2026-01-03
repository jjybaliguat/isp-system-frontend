import { BillingDataSchema, BillType } from "./billing";
import { CoverageDataSchema } from "./coverage";
import { OdpPort } from "./networks";
import { ServicePlanDataSchema } from "./service-plan";

export interface ClientDataSchema {
    id: string;
    code: string,
    fullName: string;
    accountNumber: string;
    email: string;
    status: string;
    phoneNumber: string;
    address: string;
    servicePlanId: string;
    clientTypeId: string;
    coverage?: {
        id: string
        name: string
    }
    coverageId?: string
    mikrotikAccount?: string;
    installationDate?: string;
    billingDay: number;
    createBill?: BillType | undefined;
    clientType: {
        name: string
    }
    servicePlan: {
        name: string,
        monthlyFee: number
    },
    odpPortId?: string
    odpPort?: {
        id: string
        portNumber: number
    }
    provider?: {
        settings: {
            invoiceDocument: {
                companyLogoUrl: string
            }
        },
        companyName: string,
        companyAddress: string,
        companyLogoUrl: string,
        email: string,
        phoneNumber: string
    },
    accounts?: Accounts[]
}

export interface Accounts {
    id: string
    servicePlan: servicePlanSchema
    coverage: CoverageDataSchema
    client: ClientDataSchema
    clientId: string
    servicePlanId: string
    clientTypeId:     string
    coverageId:      string
    accountNumber: string
    createdAt:     string
    billingDay:      number
    notes:            string
    mikrotikAccount:  string   
    status:           string
    paymentType:     string
    installationDate: string
    address: string
    taxStatus: string
    odpPort?: OdpPort
    generateBill?: BillType | undefined
    proRatedDays?: string
    billings?: BillingDataSchema[]
}

export interface servicePlanSchema {
    id: string,
    name: string
    monthlyFee: number
}

export interface clientTypeSchema {
    id: string,
    name: string,
    clients?: {
        id: string,
        name: string
    }
}

export interface ClientsCountSchema {
    total: string
    active: string
    partiallyDisconnected: string
    terminated: string
}

export interface ChartData {
  date: string
  new: number
  terminated: number
}

export interface BillingHistoryItem {
  invoiceNumber: string
  billingDate: string | Date
  dueDate: string | Date
  period?: string
  amount: number
  discount: number
  paidAmount: number
  status: string
}

export interface AccountStatement {
  accountNumber: string
  servicePlan: string
  billingHistory: BillingHistoryItem[]
  totalBilled: number
  totalPaid: number
  outstanding: number
}

export interface SoaClient {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  address: string
  accountNumbers: string[]
}

export interface SoaPeriod {
  start: string | Date
  end: string | Date
}

export interface SoaData {
    provider: {
           companyAddress: string,
           companyLogoUrl: string,
           companyName: string,
           email: string,
           phoneNumber: string

   },
  client: SoaClient
  statement: AccountStatement[]
  generatedAt: string | Date
  period: SoaPeriod
}
