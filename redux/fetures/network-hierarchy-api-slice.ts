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
    getOdps : builder.query<ODP[], {search: string}>({
      query: ({search}) => ({
        url: `/network-hierarchy/odp?search=${search}`,
        method: "GET",
      }),
      providesTags: ["NetworkHierarchy"],
    }),
    getOdpPorts : builder.mutation<OdpPort[], string>({
      query: (odpId) => ({
        url: `/network-hierarchy/odp-ports?odpId=${odpId}`,
        method: "GET",
      }),
      invalidatesTags: ["NetworkHierarchy"]
    }),
    getOdpPort : builder.mutation<OdpPort, string>({
      query: (accountId) => ({
        url: `/network-hierarchy/odp-port?odpId=${accountId}`,
        method: "GET",
      }),
      invalidatesTags: ["NetworkHierarchy"]
    }),
    createOLT: builder.mutation<OLT, Partial<OLT>>({
      query: (body) => ({
        url: "/network-hierarchy/olt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    updateOLT: builder.mutation<OLT, { id: string; data: Partial<OLT> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/olt/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deleteOLT: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/olt/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    createPonPort: builder.mutation<PonPort, Partial<PonPort> & { oltId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/pon-port",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    updatePonPort: builder.mutation<PonPort, { id: string; data: Partial<PonPort> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/pon-port/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deletePonPort: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/pon-port/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    createLCP: builder.mutation<LCP, Partial<LCP> & { ponPortId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/lcp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    updateLCP: builder.mutation<LCP, { id: string; data: Partial<LCP> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/lcp/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deleteLCP: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/lcp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    createODC: builder.mutation<ODC, Partial<ODC> & { lcpId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odc",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    updateODC: builder.mutation<ODC, { id: string; data: Partial<ODC> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/odc/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deleteODC: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    createODP: builder.mutation<ODP, Partial<ODP> & { lcpId: string, odcId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    createOdpPort: builder.mutation<ODP, Partial<OdpPort> & { odpId: string }>({
      query: (body) => ({
        url: "/network-hierarchy/odp-port",
        method: "POST",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    assignAccountToPort: builder.mutation<ODP, Partial<OdpPort> & { portId: string }>({
      query: (body) => ({
        url: `/network-hierarchy/odp-port/assign`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Clients", "Logs"],
    }),
    unAssignAccountToPort: builder.mutation<void, {accountId: string}>({
      query: (body) => ({
        url: `/network-hierarchy/odp-port/unassign`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["NetworkHierarchy", "Clients", "Logs"],
    }),
    updateODP: builder.mutation<ODP, { id: string; data: Partial<ODP> }>({
      query: ({ id, data }) => ({
        url: `/network-hierarchy/odp/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deleteODP: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odp/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
    }),
    deleteOdpPort: builder.mutation<void, string>({
      query: (id) => ({
        url: `/network-hierarchy/odp-port/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkHierarchy", "Logs"],
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
  useAssignAccountToPortMutation,
  useUnAssignAccountToPortMutation,
  useGetOdpsQuery,
  useGetOdpPortsMutation,
  useGetOdpPortMutation
} = networkHierarchyApiSlice
