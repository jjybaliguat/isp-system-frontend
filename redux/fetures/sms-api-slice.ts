import { PaginatedResponse } from "@/types/billing"
import { apiSlice } from "../apiSlice"
import { SmsDataInput, SmsDataSchema } from "@/types/sms"

interface GetClientsParams {
  page?: number
  limit?: number
}

export const smsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSms: builder.query<PaginatedResponse<SmsDataSchema>, GetClientsParams>({
      query: ({ page = 1, limit = 10}) => ({
        url: `/sms?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: [{ type: "SMS", id: "LIST" }],
    }),
    sendSms: builder.mutation<SmsDataSchema, SmsDataInput>({
        query: (body) => ({
            url: "/sms",
            method: "POST",
            body
        }),
        invalidatesTags: ["SMS", "Logs"],
    })
  }),
})

export const {
  useGetSmsQuery,
  useSendSmsMutation
} = smsApiSlice
