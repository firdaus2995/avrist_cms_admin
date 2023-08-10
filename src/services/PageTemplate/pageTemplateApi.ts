import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const pageTemplateApi: any = createApi({
  reducerPath: 'pageTemplateApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getPageTemplate: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query pageTemplateList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            pageTemplateList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              templates {
                id
                filenameCode
                name
                shortDesc
                createdBy {
                  id
                  name
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    deletePageTemplate: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation pageTemplateDelete($id: Int!) {
            pageTemplateDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    editPageTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageTemplateUpdate(
            $id: Int!
            $filenameCode: String!
            $name: String!
            $shortDesc: String!
            $attributes: Any
            $configs: Any
          ) {
            pageTemplateUpdate(
              id: $id
              request: { filenameCode: $filenameCode, name: $name, shortDesc: $shortDesc }
            ) {
              id
              filenameCode
              name
              shortDesc
            }
          }
        `,
        variables: payload,
      }),
    }),
    createPageTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageTemplateCreate(
            $filenameCode: String!
            $name: String!
            $shortDesc: String!
            $attributes: Any
            $configs: Any
          ) {
            pageTemplateCreate(
              request: {
                filenameCode: $filenameCode
                name: $name
                shortDesc: $shortDesc
                attributes: $attributes
                configs: $configs
              }
            ) {
              id
              filenameCode
              name
              shortDesc
              attributes {
                fieldType
                fieldId
                description
              }
              configs {
                key
                description
              }
              createdBy {
                id
                name
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
  useGetPageTemplateQuery,
  useDeletePageTemplateMutation,
  useEditPageTemplateMutation,
  useCreatePageTemplateMutation,
} = pageTemplateApi;
