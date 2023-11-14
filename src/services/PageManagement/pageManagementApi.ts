import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '@/utils/Interceptor';

export const pageManagementApi = createApi({
  reducerPath: 'pageManagementApi',
  baseQuery: customFetchBase,
  tagTypes: ['getPageManagement'],
  endpoints: builder => ({
    getPageManagementList: builder.query<any, any>({
      providesTags: ['getPageManagement'],
      query: payload => ({
        document: gql`
          query pageList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
            $filterBy: String
            $startDate: String
            $endDate: String
            $isArchive: Boolean
            $dataType: String
          ) {
            pageList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
                filterBy: $filterBy
                startDate: $startDate
                endDate: $endDate
                isArchive: $isArchive
                dataType: $dataType
              }
            ) {
              total
              pages {    
                id
                title
                dataType
                status
                createdBy 
                createdAt
                updatedAt
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getPageManagementApprovedList: builder.query<any, any>({
      query: () => ({
        document: gql`
          query pageApprovedListForMenu {
            pageApprovedListForMenu {
              total
              pages {
                id
                title
              }
            }
          }
        `,
      }),
    }),
    deletePage: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation pageDelete($id: Int!) {
            pageDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    deletePageHard: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation pageHardDelete($id: Int!) {
            pageHardDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    restorePage: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation pageRestore($id: Int!) {
            pageRestore(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    pageLogApproval: builder.query<any, { id: number }>({
      query: payload => ({
        document: gql`
          query pageLogApproval($id: Int!) {
            pageLogApproval(id: $id) {
              logs {
                date
                value {
                  status
                  comment
                  actionText
                  user
                  role
                  createdAt
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    duplicatePage: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeDuplicate($id: Int!) {
            postTypeDuplicate(request: { postTypeGroup: "CONTENT_TYPE", id: $id }) {
              id
              name
              postTypeGroup
              slug
              isUseCategory
            }
          }
        `,
        variables: payload,
      }),
    }),
    getPageMyTaskList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query pageMyTaskList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
            $dataType: String
          ) {
            pageMyTaskList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
                dataType: $dataType
              }
            ) {
              total
              pages {
                id
                title
                status
                createdAt
                createdBy
                updatedAt
                dataType
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getPageById: builder.query<any, { id: number }>({
      query: payload => ({
        document: gql`
          query pageById($id: Int!) {
            pageById(id: $id) {
              id
              title
              dataType
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              lastEdited {
                  editedBy
                  editedAt
              }
              pageTemplate {
                id
                name
                imageUrl
              }
              postType {
                id
                name
              }
              status
            }
          }
        `,
        variables: payload,
      }),
    }),
    createPageData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageCreate(
            $title: String!
            $dataType: String!
            $slug: String!
            $metatitle: String!
            $metaDescription: String!
            $shortDesc: String
            $content: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $pageTemplateId: Int!
            $postTypeId: Int
          ) {
            pageCreate(
              request: {
                title: $title
                dataType: $dataType
                slug: $slug
                metaTitle: $metatitle
                metaDescription: $metaDescription
                shortDesc: $shortDesc
                content: $content
                isDraft: $isDraft
                isAutoApprove: $isAutoApprove
                pageTemplateId: $pageTemplateId
                postTypeId: $postTypeId
              }
            ) {
              id
              title
              dataType
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              pageTemplate {
                  id
                  name
                  imageUrl
              }        
              postType {
                  id
                  name
              }
              status
            }
          }
        `,
        variables: payload,
      }),
    }),
    updatePageStatus: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageUpdateStatus($id: Int!, $status: String!, $comment: String!) {
            pageUpdateStatus(request: { id: $id, status: $status, comment: $comment }) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    updatePageData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageUpdate(
            $id: Int!
            $title: String!
            $dataType: String!
            $slug: String!
            $metatitle: String!
            $metaDescription: String!
            $shortDesc: String!
            $content: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $pageTemplateId: Int!
            $postTypeId: Int!
          ) {
            pageUpdate(
              request: {
                title: $title
                dataType: $dataType
                slug: $slug
                metaTitle: $metatitle
                metaDescription: $metaDescription
                shortDesc: $shortDesc
                content: $content
                isDraft: $isDraft
                isAutoApprove: $isAutoApprove
                pageTemplateId: $pageTemplateId
                postTypeId: $postTypeId
              }
              id: $id
            ) {
              id
              title
              dataType
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              pageTemplate {
                  id
                  name
                  imageUrl
              }        
              postType {
                  id
                  name
              }
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
  useGetPageManagementListQuery,
  useGetPageManagementApprovedListQuery,
  useDeletePageMutation,
  useRestorePageMutation,
  usePageLogApprovalQuery,
  useDuplicatePageMutation,
  useGetPageMyTaskListQuery,
  useGetPageByIdQuery,
  useCreatePageDataMutation,
  useUpdatePageStatusMutation,
  useUpdatePageDataMutation,
  useDeletePageHardMutation,
} = pageManagementApi;
