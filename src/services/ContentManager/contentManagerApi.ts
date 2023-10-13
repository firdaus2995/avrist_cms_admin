import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const contentManagerApi = createApi({
  reducerPath: 'contentManagerApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getCategoryDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query categoryDetail($id: Int!) {
            categoryDetail(id: $id) {
              id
              name
              shortDesc
              postTypeId
            }
          }
        `,
        variables: payload,
      })
    }),
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
                isArchive: false
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
    createCategory: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation categoryCreate(
            $postTypeId: Int!
            $name: String!
            $shortDesc: String!
          ) {
            categoryCreate(
              request: {
                postTypeId: $postTypeId
                name: $name
                shortDesc: $shortDesc
              }
            ) {
              id
              name
              shortDesc
              postTypeId
            }
          }
        `,
        variables: payload,
      })
    }),
    createContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataCreate(
            $title: String!
            $shortDesc: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $postTypeId: Int!
            $categoryName: String!
            $contentData: [PostMetaTemplateRequest]!
          ) {
            contentDataCreate(
              request: {
                title: $title
                shortDesc: $shortDesc
                isDraft: $isDraft
                isAutoApprove: $isAutoApprove
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
    editCategory: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation categoryUpdate(
            $id: Int!
            $name: String!
            $shortDesc: String!
          ) {
            categoryUpdate(
              id: $id
              request: {
                name: $name
                shortDesc: $shortDesc
              }
            ) {
              id
              name
              shortDesc
              postTypeId
            }
          }
        `,
        variables: payload,
      })
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
          ){
            contentDataMyTaskList(postTypeId: $postTypeId,
            pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
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
    getContentDataDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query contentDataDetail(
            $id: Int!
          ){
            contentDataDetail(id: $id) {
                id
                title
                shortDesc
                categoryName
                status
                lastEdited {
                    editedBy
                    editedAt
                }
                contentData {
                    id
                    name
                    fieldType
                    config
                    value
                    contentData {
                      details {
                          id
                          name
                          fieldType
                          config
                          value
                      }
                  }
                }
            }
        }
        `,
        variables: payload,
      }),
    }),
    getContentDataLogApproval: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query contentDataLogApproval($id: Int!){
            contentDataLogApproval(id: $id) {    
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
    updateContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataUpdate(
            $title: String!
            $shortDesc: String!
            $isDraft: Boolean!
            $isAutoApprove: Boolean!
            $postTypeId: Int!
            $categoryName: String!
            $contentData: [ContentDataAttributeRequest]!
          ){
            contentDataUpdate(
                id: $postTypeId,
                request: {
                    title: $title
                    shortDesc: $shortDesc
                    isDraft: $isDraft
                    isAutoApprove: $isAutoApprove
                    categoryName: $categoryName
                    contentData: $contentData
            }) {    
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
    updateContentDataStatus: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataUpdateStatus(
            $id: Int!
            $status: String!
            $comment: String!
          ){
            contentDataUpdateStatus(
                request: {
                    id: $id
                    status: $status
                    comment: $comment
            }) {    
              message
            }
        }
        `,
        variables: payload,
      }),
    }),
    restoreContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataRestore($id: Int!){
            contentDataRestore(id: $id) {
                message
            }
        }
        `,
        variables: payload,
      }),
    }),
    hardDeleteContentData: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation contentDataHardDelete($id: Int!){
            contentDataHardDelete(id: $id) {    
                message
            }
        }
        `,
        variables: payload,
      }),
    }),
    deleteCategory: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation categoryDelete($id: Int!){
            categoryDelete(id: $id) {    
                message
            }
        }
        `,
        variables: payload,
      }),
    }),
    getEligibleAutoApprove: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query isUserEligibleAutoApprove(
            $actionType: String!
            $dataType: String!
            ){
            isUserEligibleAutoApprove(
              request: {
                actionType: $actionType
                dataType: $dataType
            }) {    
                result
            }
        }
        `,
        variables: payload,
      }),
    }),
  })
})

export const {
  useGetCategoryDetailQuery,
  useGetContentDataQuery,
  useGetArchiveDataQuery,
  useGetCategoryListQuery, 
  useRestoreDataMutation,
  useCreateCategoryMutation,
  useCreateContentDataMutation,
  useEditCategoryMutation,
  useDeleteContentDataMutation,
  useGetMyTaskListQuery,
  useGetContentDataDetailQuery,
  useGetContentDataLogApprovalQuery,
  useUpdateContentDataMutation,
  useUpdateContentDataStatusMutation,
  useRestoreContentDataMutation,
  useHardDeleteContentDataMutation,
  useDeleteCategoryMutation,
  useGetEligibleAutoApproveQuery,
} = contentManagerApi;
