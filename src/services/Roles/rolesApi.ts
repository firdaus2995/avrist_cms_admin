import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { IGetRolesPayload, IGetRolesResponse } from './types';
import customFetchBase from '../../utils/Interceptor';
export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getRoles: builder.query<IGetRolesResponse, IGetRolesPayload>({
      query: payload => ({
        document: gql`
          query roleList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            roleList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              roles {
                id
                name
                description
                permissions
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});
export const { useGetRolesQuery } = rolesApi;
