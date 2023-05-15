import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { ILoginPayload, ILoginResponse, IRefreshTokenResponse } from './types';
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
    refreshToken: builder.mutation<IRefreshTokenResponse, { token: string }>({
      query: ({ token }) => ({
        document: gql`
          mutation refreshTokenMutation($token: String!) {
            refreshToken(token: $token) {
              accessToken
              refreshToken
              roles
            }
          }
        `,
        variables: {
          token,
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = loginApi;
