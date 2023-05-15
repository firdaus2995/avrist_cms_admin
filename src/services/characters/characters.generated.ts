import * as Types from '../../gql/graphql';

import { api } from '../../api';
export type GetListCharactersQueryVariables = Types.Exact<{
  page?: Types.InputMaybe<Types.Scalars['Int']>;
}>;


export type GetListCharactersQuery = { __typename?: 'Query', characters?: { __typename?: 'Characters', info?: { __typename?: 'Info', count?: number | null } | null, results?: Array<{ __typename?: 'Character', id?: string | null, name?: string | null, image?: string | null } | null> | null } | null };

export type GetDetailCharacterQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type GetDetailCharacterQuery = { __typename?: 'Query', character?: { __typename?: 'Character', name?: string | null, status?: string | null, species?: string | null } | null };


export const GetListCharactersDocument = `
    query GetListCharacters($page: Int) {
  characters(page: $page) {
    info {
      count
    }
    results {
      id
      name
      image
      gender
    }
  }
}
    `;
export const GetDetailCharacterDocument = `
    query GetDetailCharacter($id: ID!) {
  character(id: $id) {
    name
    status
    species
  }
}
    `;

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    GetListCharacters: build.query<GetListCharactersQuery, GetListCharactersQueryVariables | void>({
      query: (variables) => ({ document: GetListCharactersDocument, variables })
    }),
    GetDetailCharacter: build.query<GetDetailCharacterQuery, GetDetailCharacterQueryVariables>({
      query: (variables) => ({ document: GetDetailCharacterDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };
export const { useGetListCharactersQuery, useLazyGetListCharactersQuery, useGetDetailCharacterQuery, useLazyGetDetailCharacterQuery } = injectedRtkApi;

