import { clientTypeSchema } from "@/types/clients";
import { apiSlice } from "../apiSlice";

export const clientTypeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getClientTypes: builder.query<clientTypeSchema[], void>({
            query: () => ({
                url: "/client-types",    // http://localhost:7000/api/client-types
                method: "GET"
            }),
            providesTags: ["ClientType"]
        }),
        createClientType: builder.mutation<clientTypeSchema[], {name: string}>({
            query: (body) => ({
                url: "/client-types",
                method: "POST",
                body
            }),
            invalidatesTags: ["ClientType"]
        }),
        deleteClientType: builder.mutation<void, {id: string}>({
            query: ({id}) => ({
                url: `/client-types/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["ClientType", "Clients"]
        }),
        updatedClientType: builder.mutation<clientTypeSchema, {id: string, body: {name: string}}>({
            query: ({id, body}) => ({
                url: `/client-types/${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ["ClientType", "Clients"]
        })
    })
})

export const {
    useGetClientTypesQuery,
    useCreateClientTypeMutation,
    useDeleteClientTypeMutation,
    useUpdatedClientTypeMutation
} = clientTypeApiSlice