import { DashboardMetrics } from "@/types/metrics"
import { apiSlice } from "../apiSlice"

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceMetrics: builder.query<DashboardMetrics, void>({
      query: () => "/analytics/finance",
      providesTags: ["Finance"],
    }),
  }),
})

export const { useGetFinanceMetricsQuery } = analyticsApiSlice
