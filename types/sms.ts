export interface SmsDataSchema {
    message_id: string
    recipient: string
    message: string
    sender_name: string
    network: string
    status: string
    type: string
    created_at: string
    apikey?: string[]
}

export interface SmsDataInput {
    recipients: string
    message: string
}

export enum SmsStatus {
    Sent = "Sent",
    Pending = "Pending",
    Failed = "Failed"
}

export enum SmsSettingsTemplate {
    SendWhenBillIsMadeTemplate = "sendWhenBillIsMadeTemplate",
    SendWhenBillIsDueTemplate = "sendWhenBillIsDueTemplate",
    SendWhenPaymentIsMadeTemplate = "sendWhenPaymentIsMadeTemplate",
    SendWhenCustomerAddedTemplate = "sendWhenCustomerAddedTemplate",
    SendDaysBeforeDueTemplate = "sendDaysBeforeDueTemplate"
}