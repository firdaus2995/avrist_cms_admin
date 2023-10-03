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
              }
            ) {
              total
              pages {
                id
                title
                slug
                metaTitle
                metaDescription
                shortDesc
                content
                imgFilename
                pageTemplateId
                postTypeId
                pageStatus
                comment
                isDeleted
                isPublished
                createdAt
                createdBy {
                  id
                  name
                  role {
                    name
                  }
                }
                updatedAt
                updatedBy {
                  id
                  name
                  role {
                    name
                  }
                }
                reviewedAt
                reviewedBy {
                  id
                  name
                  role {
                    name
                  }
                }
                publishedAt
                publishedBy {
                  id
                  name
                  role {
                    name
                  }
                }
                rejectedAt
                rejectedBy {
                  id
                  name
                  role {
                    name
                  }
                }
                requestDeleteAt
                requestDeleteBy {
                  id
                  name
                  role {
                    name
                  }
                }
                deleteReviewAt
                deleteReviewBy {
                  id
                  name
                  role {
                    name
                  }
                }
                deleteApproveAt
                deleteApproveBy {
                  id
                  name
                  role {
                    name
                  }
                }
                deleteRejectAt
                deleteRejectBy {
                  id
                  name
                  role {
                    name
                  }
                }
                restoredAt
                restoredBy {
                  id
                  name
                  role {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: payload,
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
                  pageStatus
                  comment
                  createdByName
                  logCreatedAt
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
          ) {
            pageMyTaskList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              pages {
                id
                title
                pageStatus
                createdAt
                createdBy
                updatedAt
                updatedBy
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
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              imgFilename
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
              pageStatus
              comment
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
            $slug: String!
            $metatitle: String!
            $metaDescription: String!
            $shortDesc: String!
            $content: String!
            $imgFilename: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $pageTemplateId: Int!
            $postTypeId: Int!
          ) {
            pageCreate(
              request: {
                title: $title
                slug: $slug
                metaTitle: $metatitle
                metaDescription: $metaDescription
                shortDesc: $shortDesc
                content: $content
                imgFilename: $imgFilename
                isDraft: $isDraft
                isAutoApprove: $isAutoApprove
                pageTemplateId: $pageTemplateId
                postTypeId: $postTypeId
              }
            ) {
              id
              title
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              imgFilename
              pageTemplate {
                id
                name
                imageUrl
              }        
              postType {
                id
                name
              }
              pageStatus
              comment
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
            $slug: String!
            $metatitle: String!
            $metaDescription: String!
            $shortDesc: String!
            $content: String!
            $imgFilename: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $pageTemplateId: Boolean!
            $postTypeId: Boolean!
          ) {
            pageUpdate(
              request: {
                title: $title
                slug: $slug
                metaTitle: $metatitle
                metaDescription: $metaDescription
                shortDesc: $shortDesc
                content: $content
                imgFilename: $imgFilename
                isDraft: $isDraft
                isAutoApprove: $isAutoApprove
                pageTemplateId: $pageTemplateId
                postTypeId: $postTypeId
              }
              id: $id
            ) {
              id
              title
              slug
              metaTitle
              metaDescription
              shortDesc
              content
              imgFilename
              pageTemplate {
                id
                name
                imageUrl
              }
              postType {
                id
                name
              }
              pageStatus
              comment
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
  useDeletePageMutation,
  useRestorePageMutation,
  usePageLogApprovalQuery,
  useDuplicatePageMutation,
  useGetPageMyTaskListQuery,
  useGetPageByIdQuery,
  useCreatePageDataMutation,
  useUpdatePageStatusMutation,
  useUpdatePageDataMutation,
} = pageManagementApi;
