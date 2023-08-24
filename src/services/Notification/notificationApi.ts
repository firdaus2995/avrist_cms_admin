import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const notificationApi: any = createApi({
  reducerPath: 'notificationApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    seeNotification: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation notificationMarkAsSeen {
            notificationMarkAsSeen {
              message
            }
          }
        `,
        variables: payload,
      })
    }),
    getNotification: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query notificationList(
            $limit: Int!
          ) {
            notificationList(
              pageableRequest: {
                pageIndex: 0
                limit: $limit
              }
            ) {
              total
              notifications {
                id
                title
                content
                link
                isRead
                createdAt
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
  useSeeNotificationMutation,
  useGetNotificationQuery,
} = notificationApi;