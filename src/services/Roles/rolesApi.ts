import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import {
  IGetPermissionResponse,
  IGetRolesPayload,
  IGetRolesResponse,
  IRoleRequestPayload,
  IRoleRequestResponse,
} from './types';
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

    getPermissionHirarky: builder.query<IGetPermissionResponse, null>({
      query: () => ({
        document: gql`
          query permissionQuery {
            permissionHierarchy {
              list {
                categoryLabel
                listContent {
                  titleLabel
                  listDetail {
                    permission
                    permissionTitle
                    permissionTitleLabel
                    isChecked
                  }
                }
              }
            }
          }
        `,
      }),
    }),
    roleRequest: builder.mutation<IRoleRequestResponse, IRoleRequestPayload>({
      query: payload => ({
        document: gql`
          mutation roleCreate($name: String!, $description: String, $permissions: String!) {
            roleCreate(
              request: { name: $name, description: $description, permissions: $permissions }
            ) {
              name
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});
export const { useGetRolesQuery, useGetPermissionHirarkyQuery, useRoleRequestMutation } = rolesApi;
