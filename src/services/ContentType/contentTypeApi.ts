import { 
  createApi,
} from "@reduxjs/toolkit/dist/query/react";
import { 
  gql,
} from "graphql-request";

import customFetchBase from "../../utils/Interceptor";
export const contentTypeApi = createApi({
  reducerPath: 'contentTypeApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    getConfig: builder.query({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "CONTENT_TYPE_ATTRIBUTE_LIST") {    
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
    postTypeCreate: builder.mutation<any, { id: number }>({
      query: payload => ({
        document: gql`
          mutation postTypeCreate($name: String! $slug: String! $isUseCategory: Boolean $attributeRequests: [PostMetaTemplateRequest]!){
            postTypeCreate(
                request: {
                    name: $name
                    postTypeGroup: "CONTENT_TYPE"
                    slug: $slug
                    isUseCategory: $isUseCategory
                    attributeRequests: $attributeRequests
                }
            ) {
                id
                name
                postTypeGroup
                slug
                isUseCategory
            }
        }
        `,
        variables: payload,
      }),
    }),
  })
})

export const {
  useGetConfigQuery,
  usePostTypeCreateMutation,
} = contentTypeApi;