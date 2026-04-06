import { MikroTikDevice, MikroTikRemoteStatusResponse } from "@/types/mikrotik"
import { apiSlice } from "../apiSlice"
import { CreateTeamInput, TeamsDataSchema } from "@/types/teams"
import { PaginatedResponse } from "@/types/billing"

interface GetMikrotikParams {
  page?: number
  limit?: number
  search?: string
}

interface MikrotikDeviceInput {
    name: string
    username: string
    password: string
}

export interface MikrotikPPPProfiles {
    id: string
    name: string
    localAddress: string
    remoteAddress: string
}

interface MikrotikSystemInfo {
    identity: string,
    uptime: string,
    cpu: {
        load: number,
        count: number,
        frequency?: number
    },
    memory: {
        total: number,
        free: number,
        used: number,
    },
    version: string,
    boardName: string,
}

export const mikrotikApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMikrotikDevices: builder.query<PaginatedResponse<MikroTikDevice>, GetMikrotikParams>({
        query: () => ({
            url: "/mikrotik",
            method: "GET"
        }),
        providesTags: ["Mikrotik"]
    }),
    createMikrotikDevice: builder.mutation<MikroTikDevice, MikrotikDeviceInput>({
        query: (body) => ({
            url: "/mikrotik",
            method: "POST",
            body
        }),
        invalidatesTags: ["Mikrotik"]
    }),
    checkDeviceStatus: builder.mutation<MikroTikRemoteStatusResponse, {id: string}>({
        query: ({id}) => ({
            url: `/mikrotik/${id}/remote-status`,
            method: "GET"
        })
    }),
    deleteDevice: builder.mutation<void, {id: string}>({
        query: ({id}) => ({
            url: `/mikrotik/${id}`,
            method: "DELETE"
        }),
        invalidatesTags: ["Mikrotik"]
    }),
    updateDevice: builder.mutation<void, {id: string, data: {name: string, username: string, password: string}}>({
        query: ({id, data}) => ({
            url: `/mikrotik/${id}`,
            method: "PATCH",
            body: data
        })
    }),
    createPPP: builder.mutation<void, {routerId: string, name: string, password: string, profile: string}>({
        query: (body) => ({
            url: "/mikrotik/ppp/secret",
            method: "POST",
            body
        }),
        invalidatesTags: ["Mikrotik"]
    }),
    updatePPP: builder.mutation<void, {routerId: string, name: string, password: string, profile: string}>({
        query: (body) => ({
            url: "/mikrotik/ppp/secret",
            method: "PATCH",
            body
        }),
        invalidatesTags: ["Mikrotik"]
    }),
    getPPPProfiles: builder.query<MikrotikPPPProfiles[], {id: string}>({
        query: ({id}) => ({
            url: `/mikrotik/${id}/ppp/profile`,
            method: "GET"
        })
    }),
    getMikrotikSystem: builder.query<MikrotikSystemInfo, {id: string}>({
        query: ({id}) => ({
            url: `/mikrotik/${id}/system`,
            method: "GET"
        })
    })
  }),
})

export const { 
  useGetMikrotikDevicesQuery,
  useCreateMikrotikDeviceMutation,
  useCheckDeviceStatusMutation,
  useDeleteDeviceMutation,
  useUpdateDeviceMutation,
  useCreatePPPMutation,
  useGetPPPProfilesQuery,
  useUpdatePPPMutation,
  useGetMikrotikSystemQuery
} = mikrotikApiSlice
