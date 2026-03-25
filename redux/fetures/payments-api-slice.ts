import { PaginatedResponse, PaymentDataSchema } from "@/types/billing"
import { apiSlice } from "../apiSlice"

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<
      PaginatedResponse<PaymentDataSchema>,
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
        return `/payments?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }: { id: string }) => ({ type: "Payments" as const, id })), { type: "Payments", id: "LIST" }]
          : [{ type: "Payments", id: "LIST" }],
    })
  }),
})

export const {
  useGetPaymentsQuery,
} = paymentApiSlice
