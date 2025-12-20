import { EmployeesDataSchema } from "@/types/employees"
import { apiSlice } from "../apiSlice"
import { PaginatedResponse } from "@/types/billing"
import { ClientDataSchema } from "@/types/clients"
import { CreateTeamInput, TeamsDataSchema } from "@/types/teams"

export const teamsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<TeamsDataSchema[], void>({
        query: () => ({
            url: "/teams",
            method: "GET",
        }),
        providesTags: [{ type: "Teams", id: "LIST" }],
        }),
    createTeams: builder.mutation<TeamsDataSchema, CreateTeamInput>({
      query: (body) => ({
        url: "/teams",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Teams", "Employees", "Logs"],
    }),
    updateTeam: builder.mutation<TeamsDataSchema, {id: string, data: CreateTeamInput}>({
      query: ({id, data}) => ({
        url: `/teams/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ["Teams", "Employees", "Logs"],
    }),
    deleteTeam: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/teams/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams", "Employees", "Logs"],
    }),
  }),
})

export const { 
  useGetTeamsQuery, 
  useCreateTeamsMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation
} = teamsApiSlice
