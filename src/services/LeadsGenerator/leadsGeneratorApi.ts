import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const leadsGeneratorApi = createApi({
  reducerPath: 'leadsGeneratorApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    createResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateCreate(
            $name: String!
            $narrative: String!
            $disclaimer: String!
            $images: String!
            $isDraft: Boolean!
          ) {
            resultTemplateCreate(
              request: {
                name: $name
                narrative: $narrative
                isDraft: $isDraft
                disclaimer: $disclaimer
                images: $images
              }
            ) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
            }
          }
        `,
        variables: payload,
      }),
    }),
    getResultTemplateList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query resultTemplateList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
          ) {
            resultTemplateList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
              }
            ) {
              total
              templates {
                id
                name
                narrative
                isDraft
                disclaimer
                images
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateDelete($id: Int!) {
            resultTemplateDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getResultTemplateDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query resultTemplateDetail($id: Int!) {
            resultTemplateDetail(id: $id) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateUpdate(
            $id: Int!
            $name: String!
            $narrative: String!
            $disclaimer: String!
            $images: String!
            $isDraft: Boolean!
          ) {
            resultTemplateUpdate(
              id: $id
              request: {
                name: $name
                narrative: $narrative
                isDraft: $isDraft
                disclaimer: $disclaimer
                images: $images
              }
            ) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});

export const {
  useCreateResultTemplateMutation,
  useGetResultTemplateListQuery,
  useDeleteResultTemplateMutation,
  useGetResultTemplateDetailQuery,
  useUpdateResultTemplateMutation
} = leadsGeneratorApi;
