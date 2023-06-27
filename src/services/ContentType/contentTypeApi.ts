import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const contentTypeApi = createApi({
  reducerPath: 'contentTypeApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getPostTypeList: builder.query<any, any>({
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
              postTypeGroup: "CONTENT_TYPE"
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
                isUseCategory
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});
export const { useGetPostTypeListQuery } = contentTypeApi;
