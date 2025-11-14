import { CoverageDataSchema, CoverageInput } from "@/types/coverage";
import { apiSlice } from "../apiSlice";

export const coverageApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoverage: builder.query<CoverageDataSchema[], void>({
            query: () => ({
                url: "/coverage",
                method: "GET"
            }),
            providesTags: [{ type: "Coverage", id: "LIST" }],
        }),
        createCoverage: builder.mutation<CoverageDataSchema, CoverageInput>({
            query: (body) => ({
                url: "/coverage",
                method: "POST",
                body
            }),
            invalidatesTags: ["Coverage"]
        }),
        updateCoverage: builder.mutation<CoverageDataSchema, {id: string, data: CoverageInput}>({
            query: ({id, data}) => ({
                url: `/coverage/${id}`,
                method: "PATCH",
                body: data
            }),
            invalidatesTags: ["Coverage"]
        }),
        deleteCoverage: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/coverage/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Clients", "Coverage"]
        })
    })
})

export const {
    useGetCoverageQuery,
    useCreateCoverageMutation,
    useUpdateCoverageMutation,
    useDeleteCoverageMutation
} = coverageApiSlice