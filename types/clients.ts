import { BillType } from "./billing";
import { CoverageDataSchema } from "./coverage";
import { OdpPort } from "./networks";

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