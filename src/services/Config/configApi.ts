import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getCmsEntityLogo: builder.query<any,any>({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "CMS_ENTITY_LOGO") {    
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      })
    }),
    getCmsEntityLoginDescription: builder.query<any,any>({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "CMS_ENTITY_LOGIN_DESCRIPTION") {    
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      })
    }),
    getEmailFormAttributeList: builder.query<any,any>({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "EMAIL_FORM_ATTRIBUTE_LIST") {    
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      })
    }),
  })
})

export const {
  useGetCmsEntityLogoQuery,
  useGetCmsEntityLoginDescriptionQuery,
  useGetEmailFormAttributeListQuery,
} = configApi;