import { DashboardMetrics } from "@/types/metrics"
import { apiSlice } from "../apiSlice"
import { PaginatedResponse } from "@/types/billing"

export const logsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<
          PaginatedResponse<LogsProps>,
          {
            page?: number
            limit?: number
            search?: string
            month?: string
            year?: string
            entity?: string
          }>({
          query: ({ page = 1, limit = 10, search = "", month = "", year = "", entity = "" }) => {
            const params = new URLSearchParams({
              page: page.toString(),
              limit: limit.toString(),
              ...(search && { search }),
              ...(entity && { entity }),
              ...(month && { month }),
              ...(year && { year }),
            })
            return `/logs?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }: { id: string }) => ({ type: "Logs" as const, id })), { type: "Logs", id: "LIST" }]
          : [{ type: "Logs", id: "LIST" }],
    }),
  }),
})

export const { useGetLogsQuery } = logsApiSlice
