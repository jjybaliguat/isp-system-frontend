import { BillingDataSchema, CommentsData, ConfirmPaymentInput, CreateBillingForAccountInput, CreateBillingInput, PaginatedResponse } from "@/types/billing"
import { apiSlice } from "../apiSlice"

interface BillingCommentInput {
  comment: string
  billingId: string
}

export interface PaymentProof { 
  id: string, 
  billingId: string, 
  imageUrl: string,
  billing: BillingDataSchema
  createdAt: string
}

export const billingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBillings: builder.query<
      PaginatedResponse<BillingDataSchema>,
      {
        page?: number
        limit?: number
        search?: string
        status?: string
        month?: string
        year?: string
      }>({
      query: ({ page = 1, limit = 10, search = "", status = "", month = "", year = "" }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(status && { status }),
          ...(month && { month }),
          ...(year && { year }),
        })
        return `/billing?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }: { id: string }) => ({ type: "Billings" as const, id })), { type: "Billings", id: "LIST" }]
          : [{ type: "Billings", id: "LIST" }],
    }),

    getBillingById: builder.query<BillingDataSchema, string>({
      query: (id) => `/billing/${id}`,
      providesTags: (result, error, id) => [{ type: "Billings", id }],
    }),
    getUnpaidBillingById: builder.query<BillingDataSchema, string>({
      query: (id) => `/billing/unpaid/${id}`,
      providesTags: (result, error, id) => [{ type: "Billings", id }],
    }),

    getFullYearBillingById: builder.query<BillingDataSchema[], string>({
      query: (id) => `/billing/get-fullyear-billing/${id}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }: { id: string }) => ({ type: "Billings" as const, id })), { type: "Billings", id: "LIST" }]
          : [{ type: "Billings", id: "LIST" }],
    }),

    createBilling: builder.mutation<BillingDataSchema, CreateBillingForAccountInput>({
      query: (billing) => ({
        url: "/billing/v2",
        method: "POST",
        body: billing,
      }),
      invalidatesTags: [{ type: "Billings", id: "LIST" }, { type: "Finance", id: "LIST" }, { type: "Logs", id: "LIST" }, "Clients", ],
    }),

    updateBilling: builder.mutation<BillingDataSchema, {id: string, data: CreateBillingForAccountInput}>({
      query: ({id, data}) => ({
          url: `/billing/v2/${id}`,
          method: "PATCH",
          body: data
      }),
      invalidatesTags: [{ type: "Billings", id: "LIST" }, { type: "Finance", id: "LIST" }, { type: "Logs", id: "LIST" }, "Clients", ],
    }), 
    confirmPayment: builder.mutation<BillingDataSchema, ConfirmPaymentInput>({
      query: (payment) => ({
        url: `/billing/${payment.billingId}/confirm-payment`,
        method: "POST",
        body: payment,
      }),
      invalidatesTags: (result, error, { billingId }) => [
        { type: "Billings", id: billingId },
        { type: "Billings", id: "LIST" },
        { type: "Payments", id: "LIST" },
        { type: "Finance", id: "LIST" },
        { type: "Logs", id: "LIST" },
        "Clients",
      ],
    }),

    deleteBilling: builder.mutation<void, string>({
      query: (id) => ({
        url: `/billing/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Billings", id: "LIST" }, { type: "Payments", id: "LIST" }, { type: "Finance", id: "LIST" }, { type: "Logs", id: "LIST" }, "Clients",],
    }),

    bulkDeleteBillings: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: "/billing/bulk-delete",
        method: "POST",
        body: { ids },
      }),
      invalidatesTags: [{ type: "Billings", id: "LIST" }],
    }),
    sendBillingReminderEmail: builder.mutation<void, string>({
      query: (billingId) => ({
        url: `/billing/send-email-reminder/${billingId}`,
        method: "POST"
      }),
      invalidatesTags: ["Logs"]
    }),
    sendBillingReminderSms: builder.mutation<void, string>({
      query: (billingId) => ({
        url: `/billing/send-sms-reminder/${billingId}`,
        method: "POST"
      }),
      invalidatesTags: ["Logs"]
    }),
    sendPaymentConfirmationEmail: builder.mutation<void, string>({
      query: (billingId) => ({
        url: `/billing/send-payment-confirmation-email/${billingId}`,
        method: "POST"
      }),
      invalidatesTags: ["Logs"]
    }),
    generateBill: builder.mutation<void, {month: string, year: string, startDay: string, endDay: string}>({
      query: (data) => ({
        url: `/billing/generate-bill`,
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Billings", "Finance", "Logs", "Clients"],
    }),
    createComment: builder.mutation<CommentsData, BillingCommentInput>({
      query: (body) => ({
        url: "/billing/comment",
        method: "POST",
        body
      }),
      invalidatesTags: ["Billings"]
    }),
    getPaymentProofs: builder.query<PaginatedResponse<PaymentProof>, { page?: number, limit?: number, search?: string, month?: string, year?: string}>({
        query: ({ page = 1, limit = 10, search = "", month = "", year = "" }) => {
          const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
            ...(month && { month }),
            ...(year && { year })
          })
          return `/billing/payment/proofs?${params.toString()}`
        }
      })
  }),
})

export const {
  useGetBillingsQuery,
  useGetBillingByIdQuery,
  useGetUnpaidBillingByIdQuery,
  useCreateBillingMutation,
  useConfirmPaymentMutation,
  useDeleteBillingMutation,
  useBulkDeleteBillingsMutation,
  useGetFullYearBillingByIdQuery,
  useSendBillingReminderEmailMutation,
  useSendBillingReminderSmsMutation,
  useSendPaymentConfirmationEmailMutation,
  useUpdateBillingMutation,
  useGenerateBillMutation,
  useCreateCommentMutation,
  useGetPaymentProofsQuery
} = billingApiSlice
