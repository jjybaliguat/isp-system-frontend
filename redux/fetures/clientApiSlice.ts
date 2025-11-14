import { PaginatedResponse } from "@/types/billing"
import { apiSlice } from "../apiSlice"
import { ChartData, ClientDataSchema, ClientsCountSchema } from "@/types/clients"

interface GetClientsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  coverageId?: string
}

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<ClientDataSchema>, GetClientsParams>({
      query: ({ page = 1, limit = 10, search = "", status = "", coverageId="" }) => ({
        url: `/clients?page=${page}&limit=${limit}&search=${search}&status=${status}&coverageId=${coverageId}`,
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),

    getClientsCount: builder.query<ClientsCountSchema, void>({
      query: () => ({
        url: "/clients/count",
        method: "GET",
      }),
      providesTags: ["ClientsCount"],
    }),

    getClientsChartData: builder.query<ChartData[], void>({
      query: () => ({
        url: "/clients/analytics",
        method: "GET",
      }),
      providesTags: ["ClientsAnalytics"],
    }),

    getPhoneNumbers: builder.mutation<string[], { coverageId?: string }>({
      query: ({ coverageId }) => ({
        url: coverageId
          ? `/clients/phoneNumbers/get?coverageId=${coverageId}`
          : `/clients/phoneNumbers/get`,
        method: "GET",
      }),
    }),

    createClient: builder.mutation<ClientDataSchema, Partial<ClientDataSchema>>({
      query: (credentials) => ({
        url: "/clients",
        method: "POST",
        body: { ...credentials },
      }),
      invalidatesTags: ["Clients", "ClientsCount", "ClientsAnalytics"],
    }),

    updateClient: builder.mutation<ClientDataSchema, { id: string; data: Partial<ClientDataSchema> }>({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Clients", "ClientsCount", "ClientsAnalytics", "Logs"],
    }),

    deleteClient: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients", "ClientsCount", "ClientsAnalytics", "Logs"],
    }),
  }),
})

export const {
  useGetClientsQuery,
  useGetClientsCountQuery,
  useGetClientsChartDataQuery,
  useGetPhoneNumbersMutation,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApiSlice
