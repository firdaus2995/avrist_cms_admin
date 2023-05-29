import { 
  createApi,
} from "@reduxjs/toolkit/dist/query/react";
import { 
  gql,
} from "graphql-request";

import customFetchBase from "../../utils/Interceptor";
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getUser: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query userList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            userList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              users {
                id
                username
                name
                email
                isActived
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteUser: builder.mutation<any, {id: number}>({
      query: payload => ({
        document: gql`
          mutation userDelete($id: Int!) {
            userDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      })
    }),
  })
})

export const {
  useGetUserQuery,
  useDeleteUserMutation,
} = userApi;