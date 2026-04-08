import { ClientDataSchema } from "./clients"
import { CoverageDataSchema } from "./coverage"
import { ServicePlanDataSchema } from "./service-plan"

export interface OtherPaymentOptions {
    paymentProvider: string,
    accNum: string,
    accName: string,
    qrCodeUrl?: string
}

export interface ProviderDataSchema {
    id:               string
    name:             string
    companyName:      string
    companyAddress:   string
    email:            string
    phoneNumber?:      string
    companyLogoUrl?: string
    parentProviderId?: string
    branchStatus?: string
    providerType?: ProviderType
    dailyBackup?: boolean,
    backUpEmail?: string
    otherPaymentOptions?: OtherPaymentOptions[]
    settings?: {
        billing: {
            autoInvoicing:      boolean
            invoiceGenerationDaysBeforeDue: number
            sendInvoiceReminderDaysBeforeDue: string
        },
        payment: {
            latePaymentGracePeriod: number
        },
        notifications: {
            enabled:                     boolean
            emailUser:                   string
            emailPass:               string
            emailHost: string
            emailPort: number
            invoiceReminderTemplate:     string
            paymentConfirmationTemplate: string
            overdueNoticeTemplate:       string
        },
        invoiceDocument: {
            numberPrefix:   string
            startingNumber: number
            includeTax:     boolean
            taxRate:        number
            companyLogoUrl: string
            footerMessage:  string
        }
    }
    _count: {
        clients: number
    }
    clients?: ClientDataSchema[]
    servicePlans?: ServicePlanDataSchema[],
    coverage?: CoverageDataSchema[]
}

export enum ProviderType {
    MAIN = "MAIN",
    BRANCH = "BRANCH"
}