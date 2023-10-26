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
            $shortDesc: String!
            $icon: String!
          ) {
            menuCreate(
              request: {
                title: $title
                menuType: $menuType
                externalUrl: $externalUrl
                isNewTab: $isNewTab
                pageId: $pageId
                shortDesc: $shortDesc
                icon: $icon
              }
            ) {
              title
              menuType
              externalUrl
              isNewTab
              pageId
              shortDesc
              icon
            }
          }
        `,
        variables: payload,
      }),
    }),
    getMenuList: builder.query({
      query: payload => ({
        document: gql`
          query{
            menuList {
              lastPublishedBy
              lastPublishedAt
              status
              menus {
                id
                title
                menuType
                externalUrl
                isNewTab
                pageId
                parentId
                child {
                  id
                  title
                  menuType
                  externalUrl
                  isNewTab
                  pageId
                  parentId
                  child {
                    id
                    title
                    menuType
                    externalUrl
                    isNewTab
                    pageId
                    parentId
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
            $id: Int!
            $title: String!
            $menuType: String!
            $externalUrl: String!
            $isNewTab: Boolean!
            $pageId: Int
            $shortDesc: String
            $icon: String
          ) {
            menuUpdate(
              id: $id
              request: {
                title: $title
                menuType: $menuType
                externalUrl: $externalUrl
                isNewTab: $isNewTab
                pageId: $pageId
                shortDesc: $shortDesc
                icon: $icon
              }
            ) {
              id
              title
              menuType
              externalUrl
              isNewTab
              pageId
              shortDesc
              icon
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuDelete($id: Int!, $takedownNote: String!) {
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
          mutation menuStructureUpdate($menu: Menu!, $menuList: [Menu]!) {
            menuStructureUpdate(request: { menu: $menu, menuList: $menuList }) {
              status
            }
          }
        `,
        variables: payload,
      }),
    }),
    publishMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuPublish {
            menuPublish {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getMenuLogList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query menuLogList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            menuLogList(
              pageableRequest: { 
                pageIndex: $pageIndex, 
                limit: $limit, 
                sortBy: $sortBy, 
                direction: $direction, 
                search: $search 
              }
            ) {
              total
              menuLogs {
                id
                title
                action
                createdBy
                createdAt
                takedownNote
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getMenuById: builder.query<any, { id: number }>({
      query: payload => ({
        document: gql`
          query menuById($id: Int!) {
            menuById(id: $id) {
              id
              title
              menuType
              externalUrl
              isNewTab
              pageId
              shortDesc
              icon
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
  usePublishMenuMutation,
  useGetMenuLogListQuery,
  useGetMenuByIdQuery,
} = menuApi;
