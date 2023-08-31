import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const userApi: any = createApi({
  reducerPath: 'userApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getUserDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query userById($id: Int!) {
            userById(id: $id) {
              id
              userId
              fullName
              email
              dob
              gender
              company
              isActive
              role {
                id
                name
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getUser: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query userList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            userList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                direction: $direction
                search: $search
                sortBy: $sortBy
              }
            ) {
              total
              users {
                id
                userId
                fullName
                email
                dob
                gender
                company
                isActive
                role {
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
    getRole: builder.query<any, any>({
      query: () => ({
        document: gql`
          query {
            roleList(
              pageableRequest: {
                pageIndex: 0
                limit: 9999
                sortBy: "id"
                direction: "asc"
                search: ""
              }
            ) {
              total
              roles {
                id
                name
              }
            }
          }
        `,
      }),
    }),
    deleteUser: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation userDelete($id: Int!) {
            userDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    createUser: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation userCreate(
            $userId: String!
            $password: String!
            $fullName: String!
            $email: String!
            $dob: String!
            $gender: Boolean!
            $company: String!
            $roleId: Int!
          ) {
            userCreate(
              request: {
                userId: $userId
                password: $password
                fullName: $fullName
                email: $email
                dob: $dob
                gender: $gender
                company: $company
                roleId: $roleId
              }
            ) {
              id
              userId
              fullName
              email
              dob
              gender
              company
              isActive
              role {
                id
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    editUser: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation userUpdate(
            $id: Int!
            $fullName: String!
            $email: String!
            $dob: String!
            $gender: Boolean!
            $company: String!
            $roleId: Int!
          ) {
            userUpdate(
              id: $id
              request: {
                fullName: $fullName
                email: $email
                dob: $dob
                gender: $gender
                company: $company
                roleId: $roleId
              }
            ) {
              id
              userId
              fullName
              email
              dob
              gender
              company
              isActive
              role {
                id
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getUserProfile: builder.query({
      query: payload => ({
        document: gql`
          query {
            userProfile {
              id
              userId
              fullName
              email
              dob
              gender
              company
              profilePicture
              isActive
              role {
                id
                name
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    editUserProfile: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation userUpdateProfile(
            $fullName: String!
            $profilePicture: String!
          ) {
            userUpdateProfile(
              request: {
                fullName: $fullName
                profilePicture: $profilePicture
              }
            ) {
              id
              userId
              fullName
              email
              dob
              gender
              company
              isActive
              role {
                id
                name
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    changePasswordUserProfile: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation userChangeOwnPassword(
            $oldPassword: String!
            $newPassword: String!
          ) {
            userChangeOwnPassword(
              request: {
                oldPassword: $oldPassword
                newPassword: $newPassword
              }
            ) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getForgotPassword: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation userForgotPassword($email: String!) {
            userForgotPassword(email: $email) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    setNewPassword: builder.mutation<any, { requestId: string; newPassword: string }>({
      query: payload => ({
        document: gql`
          mutation userResetPassword($requestId: String!, $newPassword: String!) {
            userResetPassword(request: { requestId: $requestId, newPassword: $newPassword }) {
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
  useGetUserDetailQuery,
  useGetUserQuery,
  useGetRoleQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useEditUserMutation,
  useGetUserProfileQuery,
  useEditUserProfileMutation,
  useChangePasswordUserProfileMutation,
  useGetForgotPasswordMutation,
  useSetNewPasswordMutation,
} = userApi;
