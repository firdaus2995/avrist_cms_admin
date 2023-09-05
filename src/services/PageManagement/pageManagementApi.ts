import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { IGetPageManagementListPayload } from './types';
import customFetchBase from '../../utils/Interceptor';

export const pageManagementApi = createApi({
  reducerPath: 'pageManagementApi',
  baseQuery: customFetchBase,
  tagTypes: ['getPageManagement'],
  endpoints: builder => ({
    getPageManagementList: builder.query<any, IGetPageManagementListPayload>({
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
                createdBy
                updatedAt
                updatedBy
                reviewedAt
                reviewedBy
                publishedAt
                publishedBy
                rejectedAt
                rejectedBy
                requestDeleteAt
                requestDeleteBy
                deleteReviewAt
                deleteReviewBy
                deleteApproveAt
                deleteApproveBy
                deleteRejectAt
                deleteRejectBy
                restoredAt
                restoredBy
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
  }),
});

export const {
  useGetPageManagementListQuery,
  useDeletePageMutation,
  useRestorePageMutation,
  usePageLogApprovalQuery,
  useDuplicatePageMutation,
  useGetPageMyTaskListQuery,
} = pageManagementApi;
