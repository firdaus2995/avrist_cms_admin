// import { createApi } from '@reduxjs/toolkit/query/react';
// import { gql } from 'graphql-request';
// import { IGetPageManagementListResponse, IGetPageManagementListPayload } from './types';
// import customFetchBase from '../../utils/Interceptor';
// export const pageManagementApi = createApi({
//   reducerPath: 'pageManagementApi',
//   baseQuery: customFetchBase,
//   tagTypes: ['getPageManagement'],
//   endpoints: builder => ({
//     // page management
//     getPageManagementList: builder.query<IGetPageManagementListResponse, IGetPageManagementListPayload>({
//       providesTags: ['getPageManagement'],
//       query: payload => ({
//         document: gql`
//           query roleList(
//             $pageIndex: Int!
//             $limit: Int!
//             $sortBy: String
//             $direction: String
//             $search: String
//           ) {
//             pageList(
//               pageableRequest: {
//                 pageIndex: $pageIndex
//                 limit: $limit
//                 sortBy: $sortBy
//                 direction: $direction
//                 search: $search
//                 isArchive: $isArchive
//               }
//             ) {
//               total
//               pages {
//                 id
//                 pageStatus
//                 title
//                 slug
//                 publishedAt
//                 pageTemplateId
//               }
//             }
//           }
//         `,
//         variables: payload,
//       }),
//     }),
//   }),
// });
// export const { useGetPageManagementListQuery } = pageManagementApi;
