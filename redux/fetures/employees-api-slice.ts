import { EmployeesDataSchema } from "@/types/employees"
import { apiSlice } from "../apiSlice"
import { PaginatedResponse } from "@/types/billing"

export const employeesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
          PaginatedResponse<EmployeesDataSchema>,
          {
            page?: number
            limit?: number
            search?: string
            status?: string
          }>({
          query: ({ page = 1, limit = 10, search = "", status = ""}) => {
            const params = new URLSearchParams({
              page: page.toString(),
              limit: limit.toString(),
              ...(search && { search }),
              ...(status && { status }),
            })
            return `/employees?${params.toString()}`
      },
      providesTags: (result) =>
        result
          ? [...result.data.map(({ id }: { id: string }) => ({ type: "Employees" as const, id })), { type: "Employees", id: "LIST" }]
          : [{ type: "Employees", id: "LIST" }],
    }),
    createEmployee: builder.mutation<EmployeesDataSchema, EmployeesDataSchema>({
      query: (body) => ({
        url: "/employees",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Employees"],
    }),
    updateEmployee: builder.mutation<EmployeesDataSchema, {id: string, data: EmployeesDataSchema}>({
      query: ({id, data}) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Employees", id }, "Employees"],
    }),
    deleteEmployee: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),
  }),
})

export const { 
  useGetEmployeesQuery, 
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation
} = employeesApiSlice
