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
            contentDataList(postTypeId: $id,
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
  })
})

export const {
  useGetContentDataQuery,
  useGetArchiveDataQuery,
  useRestoreDataMutation,
} = contentManagerApi;
