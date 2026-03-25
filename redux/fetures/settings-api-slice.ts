import { OtherPaymentOptions, ProviderDataSchema } from "@/types/provider";
import { apiSlice } from "../apiSlice";

export interface NotificationsDataSchema {
  enabled: boolean;
  emailUser: string;
  emailPass: string;
  emailHost: string;
  emailPort: number;
  senderName: string;
  invoiceReminderTemplate: string;
  paymentConfirmationTemplate: string;
  overdueNoticeTemplate: string;
}
export interface PaymentSettingsSchema {
  latePaymentGracePeriod: number;
}
export interface BillingSettingsSchema {
  autoInvoicing: boolean;
  invoiceGenerationDaysBeforeDue: number;
  sendInvoiceReminderDaysBeforeDue: string;
}

export interface DocumentSettingsProps {
  numberPrefix:   string
  startingNumber: number
  includeTax:     boolean
  taxRate:        number
  companyLogoUrl: string
  footerMessage:  string
}

export interface BackupSettingsSchema {
  enabled: boolean
  backUpEmail: string
}

const SettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateNotificationSettings: builder.mutation<ProviderDataSchema, NotificationsDataSchema>({
      query: (body) => ({
            url: "/settings/notifications",
            method: "PATCH",
            body,
        }),
        invalidatesTags: ["Provider"],
    }),
    updatePaymentSettings: builder.mutation<ProviderDataSchema, PaymentSettingsSchema>({
      query: (body) => ({
            url: "/settings/payment",
            method: "PATCH",
            body,
        }),
        invalidatesTags: ["Provider"],
    }),
    updateBillingSettings: builder.mutation<ProviderDataSchema, BillingSettingsSchema>({
      query: (body) => ({
            url: "/settings/billing",
            method: "PATCH",
            body,
        }),
        invalidatesTags: ["Provider"],
    }),
    updateDocumentSettings: builder.mutation<ProviderDataSchema, DocumentSettingsProps>({
      query: (body) => ({
            url: "/settings/document", 
            method: "PATCH",
            body,
        }),
        invalidatesTags: ["Provider"],
    }),
  updateBackupSettings: builder.mutation<ProviderDataSchema, BackupSettingsSchema>({
    query: (body) => ({
      url: "/settings/backup",
      method: "PATCH",
      body,
    }),
    invalidatesTags: ["Provider"],
  }),
  savePaymentOptions: builder.mutation<void, {paymentOptions: OtherPaymentOptions[]}>({
    query: (body) => ({
      url: "/settings/payment-options",
      method: "POST",
      body
    }),
    invalidatesTags: ["Provider"]
  })
  }),
})

export const { 
    useUpdateNotificationSettingsMutation,
    useUpdatePaymentSettingsMutation,
    useUpdateBillingSettingsMutation,
    useUpdateDocumentSettingsMutation,
    useUpdateBackupSettingsMutation,
    useSavePaymentOptionsMutation
} = SettingsApiSlice;