import { BillingDataSchema, PaginatedResponse, PaymentDataSchema } from "@/types/billing"
import { apiSlice } from "../apiSlice"
import { Accounts, ChartData, ClientDataSchema, ClientsCountSchema, SoaData } from "@/types/clients"

interface GetClientsParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  coverageId?: string
  billingYear?: number
}

export interface ClientDashboardData {
  accounts: {
    id: string;
    accountNumber: string;
    activePlan: string;
    nextDueDate: string;
    outstandingBalance: number,
    serviceStatus: string
  }[]
}

interface ClientBillingWithPayment {
  billings: BillingDataSchema[];
  payments: PaymentDataSchema[]
}

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<ClientDataSchema>, GetClientsParams>({
      query: ({ page = 1, limit = 10, search = "", status = "", coverageId="", billingYear }) => ({
        url: `/clients?page=${page}&limit=${limit}&search=${search}&status=${status}&coverageId=${coverageId}&billingYear=${billingYear}`,
        method: "GET",
      }),
      providesTags: ["Clients"],
    }),
    getAccounts: builder.query<PaginatedResponse<Accounts>, GetClientsParams>({
      query: ({ page = 1, limit = 10, search = "", status = "", coverageId="" }) => ({
        url: `/clients/accounts?page=${page}&limit=${limit}&search=${search}&status=${status}&coverageId=${coverageId}`,
        method: "GET",
      }),
      providesTags: ["Accounts"],
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
      query: (body) => ({
        url: "/clients",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Clients", "ClientsCount", "ClientsAnalytics", "NetworkHierarchy", "Logs", "Billings", "SMS"],
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
    createAccount: builder.mutation<Accounts, Partial<Accounts>>({
      query: (body) => ({
        url: "/clients/account",
        method: "POST",
        body
      }),
      invalidatesTags: ["Clients", "NetworkHierarchy", "Accounts", "Logs"]
    }),
    updateClientAccount: builder.mutation<Accounts, {id: string, data: Partial<Accounts>}>({
      query: ({id, data}) => ({
        url: `/clients/account/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Clients", "NetworkHierarchy", "Accounts", "Logs"]
    }),
    deleteClientAccount: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clients/account/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Clients", "NetworkHierarchy", "Accounts", "Logs"]
    }),
    generateSoa: builder.query<SoaData, { clientId: string; startDate: string; endDate: string }>({
      query: ({ clientId, startDate, endDate }) => ({
        url: `/clients/soa/${clientId}`,
        params: { startDate, endDate },
        method: "GET",
      })
    }),
    getDashboard: builder.query<ClientDashboardData, void>({
      query: () => "/clients/portal",
    }),
    getClientBillings: builder.query<ClientBillingWithPayment, void>({
      query: () => "/clients/billings"
    })
  }),
})

export const {
  useGetClientsQuery,
  useGetAccountsQuery,
  useGetClientsCountQuery,
  useGetClientsChartDataQuery,
  useGetPhoneNumbersMutation,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useCreateAccountMutation,
  useUpdateClientAccountMutation,
  useDeleteClientAccountMutation,
  useGenerateSoaQuery,
  useGetDashboardQuery,
  useGetClientBillingsQuery
} = clientApiSlice
