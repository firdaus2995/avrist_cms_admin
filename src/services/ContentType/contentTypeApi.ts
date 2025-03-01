import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const contentTypeApi = createApi({
  reducerPath: 'contentTypeApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getConfig: builder.query({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "CONTENT_TYPE_ATTRIBUTE_LIST") {
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      }),
    }),
    postTypeCreate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeCreate(
            $name: String!
            $slug: String!
            $isUseCategory: Boolean
            $attributeRequests: [PostMetaTemplateRequest]!
            $dataType: String!
          ) {
            postTypeCreate(
              request: {
                name: $name
                postTypeGroup: "CONTENT_TYPE"
                slug: $slug
                isUseCategory: $isUseCategory
                attributeRequests: $attributeRequests
                dataType: $dataType
              }
            ) {
              id
              name
              postTypeGroup
              slug
              isUseCategory
              dataType
            }
          }
        `,
        variables: payload,
      }),
    }),
    getPostTypeList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
            $dataType: String
          ) {
            postTypeList(
              postTypeGroup: "CONTENT_TYPE"
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
              postTypeList {
                id
                name
                isUseCategory
                dataType
                singleContentDataId
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getPostTypeDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeDetail($id: Int!, $pageIndex: Int!, $limit: Int!) {
            postTypeDetail(
              request: {
                postTypeGroup: "CONTENT_TYPE"
                id: $id
                pageIndex: $pageIndex
                limit: $limit
              }
            ) {
              id
              name
              postTypeGroup
              slug
              isUseCategory
              total
              attributeList {
                id
                name
                fieldType
                fieldId
                config
                parentId
                attributeList {
                  id
                  name
                  fieldType
                  fieldId
                  config
                  parentId
                }
              }
              dataType
            }
          }
        `,
        variables: payload,
      }),
    }),
    postTypeUpdate: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation postTypeUpdate(
            $id: Int!
            $name: String!
            $slug: String!
            $isUseCategory: Boolean
            $attributeRequests: [PostMetaTemplateRequest]!
            $dataType: String!
          ) {
            postTypeUpdate(
              id: $id
              request: {
                name: $name
                postTypeGroup: "CONTENT_TYPE"
                slug: $slug
                isUseCategory: $isUseCategory
                attributeRequests: $attributeRequests
                dataType: $dataType
              }
            ) {
              id
              name
              postTypeGroup
              slug
              isUseCategory
              dataType
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
            $contentData: [ContentDataAttributeRequest]
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
    deleteContentType: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeDelete($id: Int!) {
            postTypeDelete(postTypeGroup: "CONTENT_TYPE", id: $id) {
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
  useGetConfigQuery,
  usePostTypeCreateMutation,
  useGetPostTypeListQuery,
  useLazyGetPostTypeListQuery,
  useGetPostTypeDetailQuery,
  usePostTypeUpdateMutation,
  useCreateContentDataMutation,
  useDeleteContentTypeMutation,
} = contentTypeApi;
