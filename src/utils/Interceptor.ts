import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import { Mutex } from 'async-mutex';
import { store } from '../store';
import type { RootState } from '../store';
import { setRefreshToken, setAccessToken, setRoles } from '../services/Login/slice';
import { getCredential, removeCredential } from './Credential';
import { loginApi } from '../services/Login/loginApi';
import { storeDataStorage } from './sessionStorage';
import { openToast } from '../components/atoms/Toast/slice';
const baseUrl = import.meta.env.VITE_BASE_URL;
const mutex = new Mutex();

const baseQuery = graphqlRequestBaseQuery({
  url: baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token: string = getCredential().accessToken;
    if (token) {
      headers.set('Authorization', 'Bearer ' + (getState() as RootState).loginSlice.accessToken);
    }
    return headers;
  },
});

const customFetchBase: BaseQueryFn = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.message.includes('Unauthorized')) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const token: string = getCredential().refreshToken;

        const refreshResult = await store
          .dispatch(loginApi.endpoints.refreshToken.initiate({ token }))
          .unwrap();

        if (refreshResult?.refreshToken) {
          store.dispatch(setAccessToken(refreshResult?.refreshToken.accessToken));
          store.dispatch(setRefreshToken(refreshResult?.refreshToken.refreshToken));
          store.dispatch(setRoles(refreshResult?.refreshToken.roles));
          storeDataStorage('accessToken', refreshResult?.refreshToken.accessToken);
          storeDataStorage('refreshToken', refreshResult?.refreshToken.refreshToken);
          storeDataStorage('roles', refreshResult?.refreshToken.roles);
          result = await baseQuery(args, api, extraOptions);
        } else {
          store.dispatch(setAccessToken(''));
          store.dispatch(setRefreshToken(''));
          store.dispatch(setRoles([]));
          removeCredential();
          store.dispatch(
            openToast({
              type: 'error',
              title: 'Oops',
              message: 'Failed renew token',
            }),
          );
          window.location.assign('/login');
        }
      } catch (err) {
        store.dispatch(setAccessToken(''));
        store.dispatch(setRefreshToken(''));
        store.dispatch(setRoles([]));
        removeCredential();
        store.dispatch(
          openToast({
            type: 'error',
            title: 'Oops',
            message: 'Failed renew token',
          }),
        );
        window.location.assign('/login');
      } finally {
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export default customFetchBase;
