import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const globalConfigDataApi = createApi({
  reducerPath: 'globalConfigDataApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getGlobalConfigById: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query getDetail($id: Int!) {
            getDetail(id: $id) {
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      }),
    }),
    getGlobalConfigDataList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query configList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            configList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              configs {
                id
                variable
                value
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    createGlobalConfigData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation configCreate($variable: String!, $value: String!, $description: String!) {
            configCreate(
              request: { variable: $variable, value: $value, description: $description }
            ) {
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateGlobalConfigData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation configUpdate(
            $id: Int!
            $variable: String!
            $value: String!
            $description: String!
          ) {
            configUpdate(
              id: $id
              request: { variable: $variable, value: $value, description: $description }
            ) {
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteGlobalConfigData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation configDelete($id: Int!) {
            configDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});

export const {
  useGetGlobalConfigByIdQuery,
  useGetGlobalConfigDataListQuery,
  useCreateGlobalConfigDataMutation,
  useUpdateGlobalConfigDataMutation,
  useDeleteGlobalConfigDataMutation,
} = globalConfigDataApi;
