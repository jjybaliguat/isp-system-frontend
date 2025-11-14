import { apiSlice } from "../apiSlice";
import { PaginatedResponse } from "@/types/billing";
import { CreateUserInput, UsersDataSchema } from "@/types/users";
import { method } from "lodash";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersDataSchema[], {searchQuery: string}>({
      query: ({searchQuery}) => ({
        url: `/users?search=${searchQuery}`,
        method: "GET"
      }),
      providesTags: ["Users"]
    }),
    createUser: builder.mutation<UsersDataSchema, CreateUserInput>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body
      }),
      invalidatesTags: ["Users"]
    }),
    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Users"]
    }),
    changePassword: builder.mutation<void, {id: string, data: ChangePasswordInput}>({
      query: ({id, data}) => ({
        url: `/users/change-pass/${id}`,
        method: "PATCH",
        body: data
      })
    })
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation
} = usersApiSlice
