import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const globalConfigDataApi = createApi({
  reducerPath: 'globalConfigDataApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
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
  }),
});

export const { useGetGlobalConfigDataListQuery, useCreateGlobalConfigDataMutation } =
  globalConfigDataApi;
