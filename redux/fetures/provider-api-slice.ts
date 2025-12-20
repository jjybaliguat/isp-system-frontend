import { ProviderDataSchema } from "@/types/provider"
import { apiSlice } from "../apiSlice"
import { use } from "react";
import { get } from "lodash";

interface StoreKeyInput {
    key: string
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

export const providerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    storeXenditApiKey: builder.mutation<any, StoreKeyInput>({
        query: (body) => ({
            url: "/providers/xendit-key",
            method: "POST",
            body
        }),
        invalidatesTags: ["Xendit"],
        }),
    storeSemaphoreApiKey: builder.mutation<any, StoreKeyInput>({
        query: (body) => ({
            url: "/providers/semaphore-key",
            method: "POST",
            body
        }),
        invalidatesTags: ["Xendit"],
        }),
    getStoredKey: builder.query<{xenditApiKey: string, semaphoreApiKey: string}, void>({
        query: () => ({
            url: "/providers/stored-keys",
            method: "GET"
        })
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
  }),
})

export const { 
    useStoreXenditApiKeyMutation,
    useStoreSemaphoreApiKeyMutation,
    useGetStoredKeyQuery,
    useTestXenditKeyMutation,
    useTestSmsKeyMutation,
    useGetProviderQuery,
    useUpdateAccountMutation,
    useSaveSmsintegrationSettingsMutation,
    useGetSmsSettingsQuery
} = providerApiSlice
