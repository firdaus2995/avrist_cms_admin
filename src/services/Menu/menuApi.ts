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
          query menuGroupList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            menuGroupList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              menuGroups {
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
              request: {
                name: $name
              }
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
              request: {
                name: $name
              }
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
    getMenuList: builder.query({
      query: payload => ({
        document: gql`
          query menuList ($menuGroupId: Int!) {
            menuList (menuGroupId: $menuGroupId) {
              menuGroupName
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
          },
        `,
        variables: payload,
      }),
    }),
    createMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuCreate(
            $menuGroupId: Int!
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
                menuGroupId: $menuGroupId
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
    editMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuUpdate(
            $menuGroupId: Int!
            $menuId: Int!
            $title: String!
            $menuType: String!
            $externalUrl: String!
            $isNewTab: Boolean!
            $pageId: Int
            $shortDesc: String
            $icon: String
          ) {
            menuUpdate(
              id: $menuId
              request: {
                menuGroupId: $menuGroupId
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
          mutation menuDelete($menuGroupId: Int!, $menuId: Int!, $takedownNote: String!) {
            menuDelete(menuGroupId: $menuGroupId, id: $menuId, takedownNote: $takedownNote) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    publishMenu: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuPublish ($menuGroupId: Int!) {
            menuPublish (menuGroupId: $menuGroupId) {
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
            $menuGroupId: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            menuLogList(
              menuGroupId: $menuGroupId
              pageableRequest: { 
                pageIndex: $pageIndex, 
                limit: $limit, 
                sortBy: $sortBy, 
                direction: $direction, 
                search: $search 
              }
            ) {
              menuGroupId
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
    updateMenuStructure: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation menuStructureUpdate($menuGroupId: Int!, $menu: Menu!, $menuList: [Menu]!) {
            menuStructureUpdate(request: { menuGroupId: $menuGroupId, menu: $menu, menuList: $menuList }) {
              status
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
  useGetMenuByIdQuery,
  useGetMenuListQuery,
  useCreateMenuMutation,
  useEditMenuMutation,
  useDeleteMenuMutation,
  usePublishMenuMutation,
  useGetMenuLogListQuery,
  useUpdateMenuStructureMutation,
} = menuApi;
