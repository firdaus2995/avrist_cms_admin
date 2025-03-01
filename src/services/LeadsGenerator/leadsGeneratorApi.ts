import { createApi } from '@reduxjs/toolkit/query/react';
import { gql } from 'graphql-request';
import customFetchBase from '../../utils/Interceptor';

export const leadsGeneratorApi = createApi({
  reducerPath: 'leadsGeneratorApi',
  baseQuery: customFetchBase,
  endpoints: builder => ({
    createResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateCreate(
            $name: String!
            $narrative: String!
            $disclaimer: String
            $images: String
            $isDraft: Boolean!
            $isDefault: Boolean!
            $type: String!
            $postTypeId: Int
            $categoryId: Int
          ) {
            resultTemplateCreate(
              request: {
                name: $name
                narrative: $narrative
                isDraft: $isDraft
                disclaimer: $disclaimer
                images: $images
                isDefault: $isDefault
                type: $type
                postTypeId: $postTypeId
                categoryId: $categoryId
              }
            ) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
              isDefault
              type
              postTypeId
              categoryId
            }
          }
        `,
        variables: payload,
      }),
    }),
    getResultTemplateList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query resultTemplateList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $isDraft: Boolean
          ) {
            resultTemplateList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                isDraft: $isDraft
              }
            ) {
              total
              templates {
                id
                name
                narrative
                isDraft
                isDefault
                disclaimer
                images
                createdAt
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateDelete($id: Int!) {
            resultTemplateDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getResultTemplateDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query resultTemplateDetail($id: Int!) {
            resultTemplateDetail(id: $id) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
              postTypeId
              postTypeName
              postTypeSlug
              categoryId
              categoryName
              type
              isDefault
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateResultTemplate: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation resultTemplateUpdate(
            $id: Int!
            $name: String!
            $narrative: String!
            $disclaimer: String
            $images: String
            $isDraft: Boolean!
            $isDefault: Boolean!
            $type: String!
            $postTypeId: Int
            $categoryId: Int
          ) {
            resultTemplateUpdate(
              id: $id
              request: {
                name: $name
                narrative: $narrative
                isDraft: $isDraft
                disclaimer: $disclaimer
                images: $images
                isDefault: $isDefault
                type: $type
                postTypeId: $postTypeId
                categoryId: $categoryId
              }
            ) {
              id
              name
              narrative
              isDraft
              disclaimer
              images
              isDefault
              type
              postTypeId
              categoryId
            }
          }
        `,
        variables: payload,
      }),
    }),
    getResultTemplateType: builder.query<any, void>({
      query: payload => ({
        document: gql`
          query {
            getConfig(variable: "result_template_type") {
              id
              variable
              value
              description
            }
          }
        `,
        variables: payload,
      }),
    }),
    getQuestions: builder.query<any, void>({
      query: payload => ({
        document: gql`
          query {
            getQuestion {
              questions {
                id
                name
                question
                answers {
                  id
                  answerOrder
                  answerDesc
                  weight
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateQuestions: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation questionCreate($request: [QuestionRequest!]) {
            questionCreate(request: $request) {
              questions {
                id
                name
                question
                isDraft
                isDelete
                answers {
                  answerOrder
                  answerDesc
                  weight
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    getConditionList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query conditionList(
            $pageIndex: Int!
            $limit: Int!
            $sortBy: String
            $direction: String
            $search: String
          ) {
            conditionList(
              pageableRequest: {
                pageIndex: $pageIndex
                limit: $limit
                sortBy: $sortBy
                direction: $direction
                search: $search
              }
            ) {
              total
              conditions {
                id
                title
                resultTemplateName
                totalQuestion
                totalAnswer
                createdAt
                isDraft
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    deleteCondition: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation conditionDelete($id: Int!) {
            conditionDelete(id: $id) {
              message
            }
          }
        `,
        variables: payload,
      }),
    }),
    getQuestionList: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query {
            getQuestion {
              questions {
                id
                name
                question
                isDraft
                answers {
                  id
                  answerOrder
                  answerDesc
                  weight
                }
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    createCondition: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation conditionCreate(
            $title: String!
            $resultTemplateId: Int!
            $isDraft: Boolean!
            $questions: [ConditionQuestionRequest]
          ) {
            conditionCreate(
              request: {
                title: $title
                resultTemplateId: $resultTemplateId
                isDraft: $isDraft
                questions: $questions
              }
            ) {
              id
              title
            }
          }
        `,
        variables: payload,
      }),
    }),
    getConditionDetail: builder.query<any, any>({
      query: payload => ({
        document: gql`
          query conditionDetail($id: Int!) {
            conditionDetail(id: $id) {
              id
              title
              resultTemplateId
              questions {
                id
                conditionId
                questionId
                answerIds
              }
            }
          }
        `,
        variables: payload,
      }),
    }),
    updateCondition: builder.mutation<any, any>({
      query: payload => ({
        document: gql`
          mutation conditionUpdate(
            $id: Int!
            $title: String!
            $resultTemplateId: Int!
            $isDraft: Boolean!
            $questions: [ConditionQuestionRequest]
          ) {
            conditionUpdate(
              id: $id
              request: {
                title: $title
                resultTemplateId: $resultTemplateId
                isDraft: $isDraft
                questions: $questions
              }
            ) {
              id
              title
            }
          }
        `,
        variables: payload,
      }),
    }),
  }),
});

export const {
  useCreateResultTemplateMutation,
  useGetResultTemplateListQuery,
  useDeleteResultTemplateMutation,
  useGetResultTemplateDetailQuery,
  useUpdateResultTemplateMutation,
  useLazyGetResultTemplateTypeQuery,
  useLazyGetQuestionsQuery,
  useUpdateQuestionsMutation,
  useGetConditionListQuery,
  useDeleteConditionMutation,
  useGetQuestionListQuery,
  useCreateConditionMutation,
  useGetConditionDetailQuery,
  useUpdateConditionMutation,
} = leadsGeneratorApi;

// $id: Int
// $name: String!
// $question: String
// $isDraft: Boolean
// $isDelete: Boolean
// $answers: [AnswerRequest]

// id: $id
// name: $name
// question: $question
// isDraft: $isDraft
// isDelete: $isDelete
// answers: $answers
