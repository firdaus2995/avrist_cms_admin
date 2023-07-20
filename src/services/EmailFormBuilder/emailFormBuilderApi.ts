import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '@/utils/Interceptor';

export const emailFormBuilderApi = createApi({
  reducerPath: 'emailFormBuilder',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getEmailFormBuilderDetail: builder.query<any, any>({
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
                # value
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
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
              postTypeGroup: "EMAIL_FORM"
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
      }),
    }),
    createEmailFormBuilder: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeCreate(
            $name: String!
            $attributeRequests: [PostMetaTemplateRequest!]!
          ) {
            postTypeCreate(
              request: {
                name: $name
                postTypeGroup: "EMAIL_FORM"
                attributeRequests: $attributeRequests
              }
            ) {
              id
              name
              postTypeGroup
              slug
            }
          }
        `,
        variables: payload,
      })
    }),
    deleteEmailFormBuilder: builder.mutation<any, any>({
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
  }),
});

export const {
  useGetEmailFormBuilderDetailQuery,
  useGetEmailFormBuilderQuery,
  useCreateEmailFormBuilderMutation,
  useDeleteEmailFormBuilderMutation,
} = emailFormBuilderApi;
