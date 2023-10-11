import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { gql } from 'graphql-request';

import customFetchBase from '../../utils/Interceptor';
export const departmentApi: any = createApi({
  reducerPath: 'departmentApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getDepartment: builder.query<any, any>({
      query: () => ({
        document: gql`
          query {
            departmentList(
              pageableRequest: {
                pageIndex: 0
                limit: -1
                direction: "asc"
                search: ""
                sortBy: ""
              }
            ) {
              total
              departments {
                id
                name
                isSuper
              }
            }
          }
        `,
      }),
    }),
  }),
});

export const {
  useGetDepartmentQuery,
} = departmentApi;
