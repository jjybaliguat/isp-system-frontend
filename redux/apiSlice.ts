import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { updateToken } from "./authSlice"
import { deleteCookie } from "@/app/actions"
import { RootState } from "./store/store"

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
  credentials: "include",
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions)

  // If you want, handle other status codes, too
  if (result?.error?.status === 401) {
    // console.log('sending refresh token')

    // send refresh token to get new access token
    const refreshResult: any = await baseQuery("auth/refresh", api, extraOptions)

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(updateToken({ ...refreshResult.data }))

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired."
        deleteCookie()
      }
      return refreshResult
    }
  }

  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Clients", 
    "ClientsCount", 
    "ClientsAnalytics", 
    "Billings", 
    "Payments", 
    "Finance", 
    "Logs",
    "Tickets",
    "TicketComments",
    "Users",
    "Employees",
    "Teams",
    "Xendit",
    "SMS",
    "Coverage",
    "ServicePlan",
    "ClientType",
    "Provider",
    "NetworkHierarchy"
  ],
  endpoints: (builder) => ({}),
})
