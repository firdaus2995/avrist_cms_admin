import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const emailFormBuilderApi = createApi({
  reducerPath: 'emailFormBuilder',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getPostTypeDetail: builder.query({
      query: payload => ({
        document: gql`
          query {
            menuList {
              menus {
                title
                menuType
                externalUrl
                isNewTab
                pageId
                child {
                  title
                  menuType
                  externalUrl
                  isNewTab
                  pageId
                  child {
                    title
                    menuType
                    externalUrl
                    isNewTab
                    pageId
                  }
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});

export const { useGetPostTypeDetailQuery } = emailFormBuilderApi;
