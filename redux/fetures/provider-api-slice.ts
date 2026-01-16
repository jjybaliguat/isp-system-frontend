import { ProviderDataSchema } from "@/types/provider"
import { apiSlice } from "../apiSlice"
import { use } from "react";
import { get } from "lodash";
import { PaginatedResponse } from "@/types/billing";

interface StoreKeyInput {
    apiKey?: string | null,
    convenienceFee?: number | null,
    expiration?: number | null
}

export interface ProfileDataSchema {
    userId: string;
    fullName: string;
    email: string;
    role?: string;
    companyEmail: string
    companyName: string;
    companyAddress: string;
    phoneNumber: string;
    companyLogoUrl: string;
}

export interface SmsIntegrationSettingsInput {
    sendWhenBillIsMade?: boolean;
    sendWhenBillIsDue?: boolean;
    sendWhenPaymentIsMade?: boolean;
    sendWhenCustomerAdded?: boolean;
    sendDaysBeforeDue?: {enabled: boolean, daysBefore: number};
    sendDaysBeforeDueEnabled?: boolean;
    sendDaysBeforeDueDays?: number;
    sendWhenBillIsMadeTemplate?: string;
    sendWhenBillIsDueTemplate?: string;
    sendWhenPaymentIsMadeTemplate?: string;
    sendWhenCustomerAddedTemplate?: string;
    sendDaysBeforeDueTemplate?: string;
}

export interface ProviderCreateInput {
  name: string
  companyName: string
  companyAddress: string
  email: string
  phoneNumber: string
}

interface GetProviderParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export const providerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveXenditIntegration: builder.mutation<any, StoreKeyInput>({
        query: (body) => ({
            url: "/providers/xendit-key",
            method: "POST",
            body
        }),
        invalidatesTags: ["Integration"],
        }),
    storeSemaphoreApiKey: builder.mutation<any, {key: string}>({
        query: (body) => ({
            url: "/providers/semaphore-key",
            method: "POST",
            body
        }),
        invalidatesTags: ["Integration"],
        }),
    getStoredKey: builder.query<{xendit: {apiKey: string, convenienceFee: number, expiration: number}, semaphoreApiKey: string}, void>({
        query: () => ({
            url: "/providers/stored-keys",
            method: "GET"
        }),
        providesTags: ["Integration"]
    }),
    testXenditKey: builder.mutation<any, void>({
        query: () => ({
            url: "/providers/xendit-test",
            method: "GET"
        })
    }),
    testSmsKey: builder.mutation<any, void>({
        query: () => ({
            url: "/providers/semaphore-test",
            method: "GET"
        })
    }),
    getProvider: builder.query<ProviderDataSchema, void>({
        query: () => ({
            url: "/providers/get-provider",
            method: "GET"
        }),
        providesTags: ["Provider"],
    }),
    getProviders: builder.query<PaginatedResponse<ProviderDataSchema>, GetProviderParams>({
          query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
            url: `/providers?page=${page}&limit=${limit}&search=${search}&status=${status}`,
            method: "GET",
          }),
          providesTags: ["Providers"],
        }),
    getFilteredProviders: builder.query<ProviderDataSchema[], void>({
          query: () => ({
            url: `/providers/get-providers`,
            method: "GET",
          })
        }),
    updateAccount: builder.mutation<ProfileDataSchema, ProfileDataSchema>({
        query: (body) => ({
            url: "/providers/update-account",
            method: "PATCH",
            body
        }),
        invalidatesTags: ["Provider"]
    }),
    saveSmsintegrationSettings: builder.mutation<any, SmsIntegrationSettingsInput>({
        query: (body) => ({
            url: "/providers/sms-integration-settings",
            method: "POST",
            body
        }),
        invalidatesTags: ["SmsSettings"]
    }),
    getSmsSettings: builder.query<SmsIntegrationSettingsInput, void>({
        query: () => ({
            url: "/providers/sms-integration-settings",
            method: "GET"
        }),
        providesTags: ["SmsSettings"],
    }),
    createProvider: builder.mutation<ProviderDataSchema, ProviderCreateInput>({
        query: (body) => ({
            url: "/providers",
            method: "POST",
            body
        }),
        invalidatesTags: ["Providers"]
    }),
    deleteProvider: builder.mutation<void, string>({
        query: (id) => ({
            url: `/providers/${id}`,
            method: "DELETE"
        }),
        invalidatesTags: ["Providers"]
    }),
    backupDatabase: builder.mutation<any, void>({
        query: () => ({
            url: "/admin/backup",
            method: "GET"
        })
    })
  }),
})

export const { 
    useSaveXenditIntegrationMutation,
    useStoreSemaphoreApiKeyMutation,
    useGetStoredKeyQuery,
    useTestXenditKeyMutation,
    useTestSmsKeyMutation,
    useGetProviderQuery,
    useGetProvidersQuery,
    useGetFilteredProvidersQuery,
    useUpdateAccountMutation,
    useSaveSmsintegrationSettingsMutation,
    useGetSmsSettingsQuery,
    useCreateProviderMutation,
    useDeleteProviderMutation,
    useBackupDatabaseMutation
} = providerApiSlice
