import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/dist/query/react';

import customFetchBase from "@/utils/Interceptor";

export const emailFormBuilderApi: any = createApi({
  reducerPath: 'emailFormBuilderApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getEmailFormBuilder: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            postTypeList(
              postTypeGroup: "EMAIL_FORM",
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              postTypeList {
                  id
                  name
                  slug
              }
            }
          }
        `,
        variables: payload,
      })
    })
  }),
})

export const {
  useGetEmailFormBuilderQuery,
} = emailFormBuilderApi