import { PaginatedResponse } from "@/types/billing"
import { apiSlice } from "../apiSlice"
import { ApplicantDataSchema } from "@/types/applicant"

interface GetApplicantParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  coverageId?: string
  billingYear?: number
}

interface UpdateApplicantInput {
    applicationStatus: string
}

export const applicantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplicants: builder.query<PaginatedResponse<ApplicantDataSchema>, GetApplicantParams>({
      query: ({ page = 1, limit = 10, search = "", status = "" }) => ({
        url: `/applicants?page=${page}&limit=${limit}&search=${search}&status=${status}`,
        method: "GET",
      }),
      providesTags: ["Applicants"],
    }),
    updateApplicant: builder.mutation<ApplicantDataSchema, {id: string, body: UpdateApplicantInput}>({
        query: ({id, body}) => ({
            url: `/applicants/${id}`,
            method: "PATCH",
            body
        }),
        invalidatesTags: ["Applicants"]
    }),
    deleteApplicant: builder.mutation<void, {id: string}>({
        query: ({id}) => ({
            url: `/applicants/${id}`,
            method: "DELETE"
        }),
        invalidatesTags: ["Applicants"]
    }),
    getApplicantsCount: builder.query<number, void>({
      query: () => ({
        url: "/applicants/count",
        method: "GET"
      }),
      providesTags: ["Applicants"]
    })
  }),
})

export const {
    useGetApplicantsQuery,
    useUpdateApplicantMutation,
    useDeleteApplicantMutation,
    useGetApplicantsCountQuery
} = applicantApiSlice
