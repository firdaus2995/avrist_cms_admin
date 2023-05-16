import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import {
  IGetDetailRole,
  IGetPermissionResponse,
  IGetRolesPayload,
  IGetRolesResponse,
  IRoleCreatePayload,
  IRoleCreateResponse,
  IRoleDeleteResponse,
  IRoleUpdatePayload,
  IRoleUpdateResponse,
} from './types';
import customFetchBase from '../../utils/Interceptor';
export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: customFetchBase,
  tagTypes: ['getRoles'],
  endpoints: builder => ({
    getRoles: builder.query<IGetRolesResponse, IGetRolesPayload>({
      providesTags: ['getRoles'],
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
    roleCreate: builder.mutation<IRoleCreateResponse, IRoleCreatePayload>({
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
    getDetailRole: builder.query<IGetDetailRole, { id: number }>({
      query: ({ id }) => ({
        document: gql`
          query roleById($id: Int!) {
            roleById(id: $id) {
              id
              name
              permissions
              description
              permissionHierarchy {
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
        variables: { id },
      }),
    }),
    roleUpdate: builder.mutation<IRoleUpdateResponse, IRoleUpdatePayload>({
      query: payload => ({
        document: gql`
          mutation roleUpdate(
            $id: Int!
            $name: String!
            $description: String
            $permissions: String!
          ) {
            roleUpdate(
              id: $id
              request: { name: $name, description: $description, permissions: $permissions }
            ) {
              name
            }
          }
        `,
        variables: payload,
      }),
    }),
    roleHapus: builder.mutation<IRoleDeleteResponse, { id: number }>({
      query: payload => ({
        document: gql`
          mutation roleDelete($id: Int!) {
            roleDelete(id: $id) {
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
  useGetRolesQuery,
  useGetPermissionHirarkyQuery,
  useRoleCreateMutation,
  useGetDetailRoleQuery,
  useRoleUpdateMutation,
  useRoleHapusMutation,
} = rolesApi;
