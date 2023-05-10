import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { ILoginPayload, ILoginResponse } from './types';

const base64 = btoa(
  `${import.meta.env.VITE_USERNAME || ''}:${import.meta.env.VITE_PASSWORD || ''}`,
);
export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: graphqlRequestBaseQuery({
    url: import.meta.env.VITE_BASE_URL,
    prepareHeaders: headers => {
      headers.set('Authorization', `Basic ${base64}`);
      return headers;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation<ILoginResponse, ILoginPayload>({
      query: ({ password, username }) => ({
        document: gql`
          mutation loginMutation($username: String!, $password: String!) {
            login(username: $username, password: $password) {
              accessToken
              refreshToken
              roles
            }
          }
        `,
        variables: {
          username,
          password,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
