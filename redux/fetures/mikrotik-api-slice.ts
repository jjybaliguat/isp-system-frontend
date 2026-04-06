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

export interface PPPSecrets {
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
  mikrotikId?: string
  page?: number
  limit?: number
  search?: string
  status?: string
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

    getActivePPPV2: builder.query<
      PaginatedResponse<PPPActive>,
      RequestParams
    >({
      query: ({ mikrotikId, page = 1, limit = 10, search = "" }) => ({
        url: `/mikrotik/${mikrotikId}/ppp/active?page=${page}&limit=${limit}&search=${search}`,
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

      keepUnusedDataFor: 0,
    }),
    getPPPSecrets: builder.query<PaginatedResponse<PPPSecrets>, RequestParams>({
      query: ({ page = 1, limit = 10, search = "", status="All" }) => ({
        url: `/mikrotik/ppp/secret?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        method: "GET"
      }),
      providesTags: ["Mikrotik"]
    }),
    getPPPSecretsV2: builder.query<PaginatedResponse<PPPSecrets>, RequestParams>({
      query: ({ page = 1, limit = 10, search = "", status="All", mikrotikId }) => ({
        url: `/mikrotik/${mikrotikId}/ppp/secret?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        method: "GET"
      }),
      providesTags: ["Mikrotik"]
    }),
    updatedSecrets: builder.mutation<void, {names: string[], action: "create" | "delete" | "enable" | "disable"}>({
      query: (body) => ({
        url: `/mikrotik/ppp/secrets`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["Mikrotik", "Logs"]
    }),
    updatedSecretsV2: builder.mutation<void, {mikrotikId: string, names: string[], action: "create" | "delete" | "enable" | "disable"}>({
      query: ({mikrotikId, names, action}) => ({
        url: `/mikrotik/${mikrotikId}/ppp/secrets`,
        method: "PATCH",
        body: {names, action}
      }),
      invalidatesTags: ["Mikrotik", "Logs"]
    })
  }),
})

export const {
  useGetActivePPPQuery,
  useGetPPPHistoryQuery,
  useGetPPPSecretsQuery,
  useUpdatedSecretsMutation,
  useUpdatedSecretsV2Mutation,
  useGetActivePPPV2Query,
  useGetPPPSecretsV2Query
} = mikrotikApiSlice