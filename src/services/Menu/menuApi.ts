import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const menuApi = createApi({
  reducerPath: 'menuApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    createMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuCreate(
            $title: String!
            $menuType: String!
            $externalUrl: String!
            $isNewTab: Boolean!
            $pageId: Int!
          ) {
            menuCreate(
              request: {
                title: $title
                menuType: $menuType
                externalUrl: $externalUrl
                isNewTab: $isNewTab
                pageId: $pageId
              }
            ) {
              title
              menuType
              externalUrl
              isNewTab
              pageId
            }
          }
        `,
        variables: payload,
      }),
    }),
    getMenuList: builder.query({
      query: payload => ({
        document: gql`
          query {
            menuList {
              lastPublishedBy
              lastPublishedAt
              status
              menus {
                title
                menuType
                externalUrl
                isNewTab
                pageId
                child {
                  title
                  menuType
                  externalUrl
                  isNewTab
                  pageId
                  child {
                    title
                    menuType
                    externalUrl
                    isNewTab
                    pageId
                  }
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    editMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuUpdate(
            $title: String!
            $editedTitle: String!
            $menuType: String!
            $externalUrl: String!
            $isNewTab: Boolean!
            $pageId: Int!
          ) {
            menuUpdate(
              request: {
                title: $title
                menuType: $menuType
                externalUrl: $externalUrl
                isNewTab: $isNewTab
                pageId: $pageId
              }
              id: $editedTitle
            ) {
              title
              menuType
              externalUrl
              isNewTab
              pageId
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuDelete($id: String!, $takedownNote: String!) {
            menuDelete(id: $id, takedownNote: $takedownNote) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateMenuStructure: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuStructureUpdate($menuList: [Menu]!) {
            menuStructureUpdate(request: { menuList: $menuList }) {
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
  useCreateMenuMutation,
  useGetMenuListQuery,
  useEditMenuMutation,
  useDeleteMenuMutation,
  useUpdateMenuStructureMutation,
} = menuApi;
