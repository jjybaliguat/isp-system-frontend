import { LCP, ODC, ODP, OdpPort, OLT, PonPort } from "@/types/networks"
import { apiSlice } from "../apiSlice"

export const networkHierarchyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNetworkHierarchy: builder.query<OLT[], void>({
      query: () => ({
        url: "/network-hierarchy",
        method: "GET",
      }),
      providesTags: ["NetworkHierarchy"],
    }),
    createOLT: builder.mutation<OLT, Partial<OLT>>({
      query: (body) => ({
        url: "/network-hierarchy/olt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    updateOLT: builder.mutation<OLT, { id: string; data: Partial<OLT> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/olt/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deleteOLT: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/olt/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    createPonPort: builder.mutation<PonPort, Partial<PonPort> & { oltId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/pon-port",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    updatePonPort: builder.mutation<PonPort, { id: string; data: Partial<PonPort> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/pon-port/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deletePonPort: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/pon-port/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    createLCP: builder.mutation<LCP, Partial<LCP> & { ponPortId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/lcp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    updateLCP: builder.mutation<LCP, { id: string; data: Partial<LCP> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/lcp/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deleteLCP: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/lcp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    createODC: builder.mutation<ODC, Partial<ODC> & { lcpId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odc",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    updateODC: builder.mutation<ODC, { id: string; data: Partial<ODC> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/odc/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deleteODC: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    createODP: builder.mutation<ODP, Partial<ODP> & { odcId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    createOdpPort: builder.mutation<ODP, Partial<OdpPort> & { odpId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odp-port",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    assignClientToPort: builder.mutation<ODP, Partial<OdpPort> & { portId: string }>({
      query: (body) => ({
        url: `/network-hierarchy/odp-port/assign`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Clients"],
    }),
    unAssignClientToPort: builder.mutation<void, {clientId: string}>({
      query: (body) => ({
        url: `/network-hierarchy/odp-port/unassign`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Clients"],
    }),
    updateODP: builder.mutation<ODP, { id: string; data: Partial<ODP> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/odp/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deleteODP: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
    deleteOdpPort: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odp-port/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy"],
    }),
  }),
})

export const {
  useGetNetworkHierarchyQuery,
  useCreateOLTMutation,
  useUpdateOLTMutation,
  useDeleteOLTMutation,
  useCreatePonPortMutation,
  useUpdatePonPortMutation,
  useDeletePonPortMutation,
  useCreateLCPMutation,
  useUpdateLCPMutation,
  useDeleteLCPMutation,
  useCreateODCMutation,
  useUpdateODCMutation,
  useDeleteODCMutation,
  useCreateODPMutation,
  useCreateOdpPortMutation,
  useUpdateODPMutation,
  useDeleteODPMutation,
  useDeleteOdpPortMutation,
  useAssignClientToPortMutation,
  useUnAssignClientToPortMutation
} = networkHierarchyApiSlice
