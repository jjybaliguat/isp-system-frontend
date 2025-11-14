import { apiSlice } from "../apiSlice";
import type {
  TicketDataSchema,
  CreateTicketInput,
  UpdateTicketInput,
  TicketCommentDataSchema,
  CreateTicketCommentInput,
  TicketLogsDataSchema
} from "../../types/ticket"
import { PaginatedResponse } from "@/types/billing";

export const ticketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<
      PaginatedResponse<TicketDataSchema>,
      { page?: number; limit?: number; status?: string; priority?: string; category?: string }
    >({
      query: ({ page = 1, limit = 50, status, priority, category }) => {
        const params = new URLSearchParams()
        params.append("page", page.toString())
        params.append("limit", limit.toString())
        if (status) params.append("status", status)
        if (priority) params.append("priority", priority)
        if (category) params.append("category", category)
        return `/tickets?${params.toString()}`
      },
      providesTags: ["Tickets"],
    }),

    getAssignedTickets: builder.query<TicketDataSchema[], { userId: string; status?: string }>({
      query: ({ userId, status }) => {
        const params = new URLSearchParams()
        params.append("assignedTo", userId)
        if (status) params.append("status", status)
        return `/tickets/assigned/?${params.toString()}`
      },
      providesTags: ["Tickets"],
    }),

    getTicketById: builder.query<TicketDataSchema, string>({
      query: (id) => `/tickets/${id}`,
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
    }),

    createTicket: builder.mutation<TicketDataSchema, CreateTicketInput>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tickets"],
    }),

    updateTicket: builder.mutation<TicketDataSchema, { id: string; data: UpdateTicketInput }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tickets", "Logs"],
    }),

    deleteTicket: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
    }),

    getTicketComments: builder.query<TicketCommentDataSchema[], string>({
      query: (ticketId) => `/tickets/${ticketId}/comments`,
      providesTags: (result, error, ticketId) => [{ type: "TicketComments", id: `comments-${ticketId}` }],
    }),

    getTicketActivityLogs: builder.query<TicketLogsDataSchema[], string>({
      query: (ticketId) => `/tickets/${ticketId}/logs`,
      providesTags: (result, error, ticketId) => [{ type: "Tickets", id: `logs-${ticketId}` }],
    }),

    addTicketComment: builder.mutation<TicketCommentDataSchema, FormData>({
    query: (formData) => ({
      url: `/tickets/${formData.get("ticketId")}/comments`,
      method: "POST",
      body: formData
    }),
    invalidatesTags: (result, error, formData) => [
      { type: "Tickets", id: `comments-${formData.get("ticketId")}` },
      "TicketComments",
    ],
  }),
    deleteTicketComment: builder.mutation({
      query: (commentId) => ({
        url: `/tickets/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TicketComments"],
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketCommentsQuery,
  useGetTicketActivityLogsQuery,
  useAddTicketCommentMutation,
  useDeleteTicketCommentMutation,
  useGetAssignedTicketsQuery
} = ticketApiSlice
