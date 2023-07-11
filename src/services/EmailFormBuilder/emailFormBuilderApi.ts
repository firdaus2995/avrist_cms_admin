import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '@/utils/Interceptor';

export const emailFormBuilderApi = createApi({
  reducerPath: 'emailFormBuilder',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    deletePostType: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeDelete($id: Int!) {
            postTypeDelete(postTypeGroup: "EMAIL_FORM", id: $id) {
              postTypeGroup
              id
            }
          }
        `,
        variables: payload,
      }),
    }),
    getEmailFormDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeDetail($id: Int!, $pageIndex: Int!, $limit: Int!) {
            postTypeDetail(
              request: {
                postTypeGroup: "EMAIL_FORM"
                id: $id
                pageIndex: $pageIndex
                limit: $limit
              }
            ) {
              id
              name
              postTypeGroup
              slug
              pic
              total
              attributeList {
                id
                name
                fieldType
                fieldId
                config
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});

export const { useDeletePostTypeMutation, useGetEmailFormDetailQuery } = emailFormBuilderApi;
