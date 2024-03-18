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
            $dataType: String
          ) {
            pageTemplateList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
                dataType: $dataType
              }
            ) {
              total
              templates {
                id
                filenameCode
                name
                imageUrl
                dataType
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
            $imageUrl: String!
            $dataType: String!
            $isForm: Boolean!
            $attributes: [PageTemplateAttributeRequest]
            $configs: [PageTemplateConfigRequest]
          ) {
            pageTemplateUpdate(
              id: $id
              request: {
                filenameCode: $filenameCode
                name: $name
                shortDesc: $shortDesc
                imageUrl: $imageUrl
                dataType: $dataType
                isForm: $isForm
                attributes: $attributes
                configs: $configs
              }
            ) {
              id
              filenameCode
              name
              shortDesc
              isForm
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
    createPageTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation pageTemplateCreate(
            $filenameCode: String!
            $name: String!
            $shortDesc: String!
            $imageUrl: String!
            $dataType: String!
            $attributes: [PageTemplateAttributeRequest]
            $configs: [PageTemplateConfigRequest]
            $isForm: Boolean!
          ) {
            pageTemplateCreate(
              request: {
                filenameCode: $filenameCode
                name: $name
                shortDesc: $shortDesc
                imageUrl: $imageUrl
                dataType: $dataType
                attributes: $attributes
                configs: $configs
                isForm: $isForm
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
              isForm
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
    getPageTemplateById: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query pageTemplateById($id: Int!) {
            pageTemplateById(id: $id) {
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
              imageUrl
              dataType
              isForm
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
  useGetPageTemplateByIdQuery,
} = pageTemplateApi;
