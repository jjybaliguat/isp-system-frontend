import { ProviderDataSchema } from "@/types/provider"
import { apiSlice } from "../apiSlice"

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
    })
  }),
})

export const { 
    useStoreXenditApiKeyMutation,
    useStoreSemaphoreApiKeyMutation,
    useGetStoredKeyQuery,
    useTestXenditKeyMutation,
    useTestSmsKeyMutation,
    useGetProviderQuery,
    useUpdateAccountMutation
} = providerApiSlice
