import { ServicePlanDataSchema, ServicePlanInput } from "@/types/service-plan";
import { apiSlice } from "../apiSlice";

export const servicePlanApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getServicePlan: builder.query<ServicePlanDataSchema[], void>({
            query: () => ({
                url: "/service-plans",
                method: "GET"
            }),
            providesTags: [{type: "ServicePlan", id: "LIST"}]
        }),
        createServicePlan: builder.mutation<ServicePlanDataSchema, ServicePlanInput>({
            query: (body) => ({
                url: "/service-plans",
                method: "POST",
                body
            }),
            invalidatesTags: ["ServicePlan"]
        }),
        updateServicePlan: builder.mutation<ServicePlanDataSchema, {id: string, body: ServicePlanInput}>({
            query: ({id, body}) => ({
                url: `/service-plans/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["ServicePlan"]
        }),
        deleteServicePlan: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/service-plans/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["ServicePlan"]
        })
    })
})

export const {
    useGetServicePlanQuery,
    useCreateServicePlanMutation,
    useUpdateServicePlanMutation,
    useDeleteServicePlanMutation
} = servicePlanApiSlice