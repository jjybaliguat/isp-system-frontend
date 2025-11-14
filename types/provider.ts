export interface ProviderDataSchema {
    id:               string
    name:             string
    companyName:      string
    companyAddress:   string
    email:            string
    phoneNumber?:      string
    companyLogoUrl?: string
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
}