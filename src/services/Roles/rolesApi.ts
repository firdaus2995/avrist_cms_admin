import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { IGetRolesPayload, IGetRolesResponse } from './types';
export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: graphqlRequestBaseQuery({
    url: import.meta.env.VITE_BASE_URL,
    prepareHeaders: headers => {
      const accessToken = localStorage.getItem('accessToken');
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
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
