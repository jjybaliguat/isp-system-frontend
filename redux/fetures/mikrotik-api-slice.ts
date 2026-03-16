import { PaginatedResponse } from "@/types/billing";
import { apiSlice } from "../apiSlice";

interface Session {
  username: string
  rx_mbps: number
  tx_mbps: number
  recordedAt: string
}

interface GetActivePPpParams {
  page?: number
  limit?: number
  search?: string
}

interface PPPHistoryParams {
  username: string
  from: string
  to: string
}

const mikrotikApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Active PPP Sessions
    getActivePPP: builder.query<
      PaginatedResponse<Session>,
      GetActivePPpParams
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/mikrotik/ppp/active?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Mikrotik"],
    }),

    // PPP History Graph
    getPPPHistory: builder.query<
      Session[],
      PPPHistoryParams
    >({
      query: ({ username, from, to }) => ({
        url: `/mikrotik/ppp/history?username=${username}&from=${from}&to=${to}`,
        method: "GET",
      }),

      // history should refetch when range changes
      keepUnusedDataFor: 0,
    }),

  }),
})

export const {
  useGetActivePPPQuery,
  useGetPPPHistoryQuery
} = mikrotikApiSlice