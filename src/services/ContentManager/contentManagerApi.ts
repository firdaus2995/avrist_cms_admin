import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const contentManagerApi = createApi({
  reducerPath: 'contentManagerApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getContentData: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query contentData(
            $id: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
          ) {
            contentDataList(
              postTypeId: $id
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
              }
            ) {
              total
              contentDataList {
                id
                title
                shortDesc
                categoryName
                status
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getArchiveData: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query contentData(
            $id: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $archive: Boolean
          ){
            contentDataList(postTypeId: $id,
            pageableRequest: {
              pageIndex: $pageIndex
              limit: $limit
              sortBy: $sortBy
              direction: $direction
              isArchive: $archive
            }) {
                total
                contentDataList {
                    id
                    title
                    shortDesc
                    categoryName
                    status
                }
            }
        }
        `,
        variables: payload,
      }),
    }),
    getCategoryList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query categoryList(
            $postTypeId: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
          ) {
            categoryList(
              postTypeId: $postTypeId
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
              }
            ) {
              total
              categoryList {
                id
                name
                shortDesc
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    restoreData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataRestore(
            $id: Int!
          ){
            contentDataRestore(id: $id) {    
                id
                title
                shortDesc
                categoryName
                status
            }
        }
        `,
        variables: payload,
      }),
    }),
    createContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataCreate(
            $title: String!
            $shortDesc: String!
            $isDraft: Boolean!
            $postTypeId: Int!
            $categoryName: String!
            $contentData: [PostMetaTemplateRequest]!
          ) {
            contentDataCreate(
              request: {
                title: $title
                shortDesc: $shortDesc
                isDraft: $isDraft
                postTypeId: $postTypeId
                categoryName: $categoryName
                contentData: $contentData
              }
            ) {
              id
              title
              shortDesc
              categoryName
              status
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataDelete(
              $id: Int!
            ){
            contentDataDelete(id: $id) {    
                message
            }
        }
        `,
        variables: payload,
      }),
    }),
    getMyTaskList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query contentDataMyTaskList(
            $postTypeId: Int!
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
          ) {
            contentDataMyTaskList(
              postTypeId: $postTypeId
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
              }
            ) {
              total
              categoryList {
                id
                title
                shortDesc
                categoryName
                status
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
  })
})

export const {
  useGetContentDataQuery,
  useGetArchiveDataQuery,
  useGetCategoryListQuery, 
  useRestoreDataMutation,
  useCreateContentDataMutation,
  useDeleteContentDataMutation,
  useGetMyTaskListQuery,
} = contentManagerApi;
