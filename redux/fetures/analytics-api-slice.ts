import { DashboardMetrics } from "@/types/metrics"
import { apiSlice } from "../apiSlice"

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceMetrics: builder.query<DashboardMetrics, { month?: string; year?: string }>({
      query: ({ month, year }) => `/analytics/finance?month=${month}&year=${year}`,
      providesTags: ["Finance"],
    }),
  }),
})

export const { useGetFinanceMetricsQuery } = analyticsApiSlice
