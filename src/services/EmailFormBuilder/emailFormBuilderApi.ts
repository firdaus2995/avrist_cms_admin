import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '@/utils/Interceptor';

export const emailFormBuilderApi = createApi({
  reducerPath: 'emailFormBuilder',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getFormResult: builder.query<any, any>({
      query: () => ({
        document: gql`
          query {
            formResultList(pageableRequest: { pageIndex: 0, limit: 99 }) {
              total
              resultList {
                id
                title
                shortDesc
              }
            }
          }
        `,
      }),
    }),
    getEmailFormBuilderDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeDetail($id: Int!, $pageIndex: Int!, $limit: Int!) {
            postTypeDetail(
              request: {
                postTypeGroup: "EMAIL_FORM"
                id: $id
                pageIndex: $pageIndex
                limit: $limit
              }
            ) {
              total
              id
              name
              postTypeGroup
              slug
              pic
              enableCaptcha
              formResult {
                id
                title
                shortDesc
              }
              emailBody {
                id
                title
              }
              attributeList {
                id
                name
                fieldType
                fieldId
                config
                value
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getEmailFormBuilder: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query postTypeList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            postTypeList(
              postTypeGroup: "EMAIL_FORM"
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              postTypeList {
                id
                name
                slug
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    createEmailFormBuilder: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeCreate(
            $name: String!
            $attributeRequests: [PostMetaTemplateRequest!]!
            $formResult: Int!
          ) {
            postTypeCreate(
              request: {
                name: $name
                postTypeGroup: "EMAIL_FORM"
                attributeRequests: $attributeRequests
                formResult: $formResult
              }
            ) {
              id
              name
              postTypeGroup
              slug
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateEmailFormBuilder: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeUpdate(
            $id: Int!
            $name: String!
            $attributeRequests: [PostMetaTemplateRequest!]!
            $formResult: Int!
          ) {
            postTypeUpdate(
              id: $id
              request: {
                name: $name
                postTypeGroup: "EMAIL_FORM"
                attributeRequests: $attributeRequests
                formResult: $formResult
              }
            ) {
              id
              name
              postTypeGroup
              slug
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteEmailFormBuilder: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation postTypeDelete($id: Int!) {
            postTypeDelete(postTypeGroup: "EMAIL_FORM", id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getEmailBodyDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query emailBodyDetail($id: Int!) {
            emailBodyDetail(id: $id) {
              id
              title
              shortDesc
              value
            }
          }
        `,
        variables: payload,
      }),
    }),
    getEmailBody: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query emailBodyList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            emailBodyList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              emailBodies {
                id
                title
                shortDesc
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    createEmailBody: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation createEmailBody($title: String!, $shortDesc: String!, $value: String!) {
            createEmailBody(request: { title: $title, shortDesc: $shortDesc, value: $value }) {
              id
              title
              shortDesc
              value
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateEmailBody: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation updateEmailBody(
            $id: Int!
            $title: String!
            $shortDesc: String!
            $value: String!
          ) {
            updateEmailBody(
              id: $id
              request: { title: $title, shortDesc: $shortDesc, value: $value }
            ) {
              id
              title
              shortDesc
              value
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteEmailBody: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation emailBodyDelete($id: Int!) {
            emailBodyDelete(id: $id) {
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
  useGetFormResultQuery,
  useGetEmailFormBuilderDetailQuery,
  useGetEmailFormBuilderQuery,
  useCreateEmailFormBuilderMutation,
  useUpdateEmailFormBuilderMutation,
  useDeleteEmailFormBuilderMutation,
  useGetEmailBodyDetailQuery,
  useGetEmailBodyQuery,
  useCreateEmailBodyMutation,
  useUpdateEmailBodyMutation,
  useDeleteEmailBodyMutation,
} = emailFormBuilderApi;
