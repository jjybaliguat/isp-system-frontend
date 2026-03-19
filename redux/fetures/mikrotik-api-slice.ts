import { PaginatedResponse } from "@/types/billing";
import { apiSlice } from "../apiSlice";

interface Session {
  username: string
  rx_mbps: number
  tx_mbps: number
  recordedAt: string
}

interface PPPActive {
  name: string
  service: string
  address: string
  uptime: string
}

interface PPPSecrets {
  ".id": string
  name: string
  service: string
  "caller-id": string
  password: string
  profile: string
  routes: string
  "ipv6-routes": string
  "limit-bytes-in": string
  "limit-bytes-out": string
  "last-logged-out": string
  "last-caller-id": string
  "last-disconnect-reason": string
  disabled: string
  comment: string
}

interface RequestParams {
  page?: number
  limit?: number
  search?: string
}

interface PPPHistoryParams {
  username: string
  from: string
  to: string
  interval: number
}

const mikrotikApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // Active PPP Sessions
    getActivePPP: builder.query<
      PaginatedResponse<PPPActive>,
      RequestParams
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
      query: ({ username, from, to, interval }) => ({
        url: `/mikrotik/ppp/history?username=${username}&from=${from}&to=${to}&interval=${interval}`,
        method: "GET",
      }),

      // history should refetch when range changes
      keepUnusedDataFor: 0,
    }),
    getPPPSecrets: builder.query<PaginatedResponse<PPPSecrets>, RequestParams>({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/mikrotik/ppp/secret?page=${page}&limit=${limit}&search=${search}`,
        method: "GET"
      }),
      providesTags: ["Mikrotik"]
    })
  }),
})

export const {
  useGetActivePPPQuery,
  useGetPPPHistoryQuery,
  useGetPPPSecretsQuery
} = mikrotikApiSlice