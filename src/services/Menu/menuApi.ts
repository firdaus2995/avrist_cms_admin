import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const menuApi: any = createApi({
  reducerPath: 'menuApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getGroupMenuDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query menuGroupDetail(
            $id: Int!
          ) {
            menuGroupDetail(
              id: $id
            ) {
              id
              name
            }
          }
        `,
        variables: payload,
      }),
    }),
    getGroupMenu: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query groupMenuList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            groupMenuList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              groupMenus {
                id
                name
                status
                lastPublishedBy
                lastPublishedAt
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    createGroupMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuGroupCreate(
            $name: String!
          ) {
            menuGroupCreate(
              name: $name
            ) {
              id
              name
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateGroupMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuGroupEdit(
            $id: Int!
            $name: String!
          ) {
            menuGroupEdit(
              id: $id
              name: $name
            ) {
              id
              name
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteGroupMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuGroupDelete($id: Int!) {
            menuGroupDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    createMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuCreate(
            $title: String!
            $menuType: String!
            $externalUrl: String!
            $isNewTab: Boolean!
            $pageId: Int
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
      query: () => ({
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
            $id: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            menuLogList(
              groupMenuId: $id
              pageableRequest: { 
                pageIndex: $pageIndex, 
                limit: $limit, 
                sortBy: $sortBy, 
                direction: $direction, 
                search: $search 
              }
            ) {
              groupMenuId
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
  useGetGroupMenuDetailQuery,
  useGetGroupMenuQuery,
  useCreateGroupMenuMutation,
  useUpdateGroupMenuMutation,
  useDeleteGroupMenuMutation,
  useCreateMenuMutation,
  useGetMenuListQuery,
  useEditMenuMutation,
  useDeleteMenuMutation,
  useUpdateMenuStructureMutation,
  usePublishMenuMutation,
  useGetMenuLogListQuery,
  useGetMenuByIdQuery,
} = menuApi;
