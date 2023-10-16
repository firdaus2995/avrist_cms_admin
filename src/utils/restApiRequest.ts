import axios, { AxiosResponse } from 'axios'; // Import AxiosResponse for explicit return type annotation
import { Mutex } from 'async-mutex';
import { store } from '../store';
import { getCredential, removeCredential } from './Credential';
import { loginApi } from '../services/Login/loginApi';
import { storeDataStorage } from './SessionStorage';
import { openToast } from '../components/atoms/Toast/slice';
import { setEventTriggered } from '@/services/Event/eventErrorSlice';
import { setRefreshToken, setAccessToken, setRoles } from '../services/Login/slice';

const baseUrl = import.meta.env.VITE_BASE_URL;
const mutex = new Mutex();

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use(
  config => {
    const token = getCredential().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  async error => {
    return await Promise.reject(error);
  },
);

const restApiRequest = async (method: string, url: string, data: any = null): Promise<any> => {
  try {
    const response: AxiosResponse = await axiosInstance.request({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            const token = getCredential().refreshToken;

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
              return await restApiRequest(method, url, data); // Retry the original request after token refresh
            } else {
              store.dispatch(setAccessToken(''));
              store.dispatch(setRefreshToken(''));
              store.dispatch(setRoles([]));
              removeCredential();
              store.dispatch(
                openToast({
                  type: 'error',
                  title: 'Oops',
                  message: 'Failed to renew token',
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
                message: 'Failed to renew token',
              }),
            );
            window.location.assign('/login');
          } finally {
            release();
          }
        } else {
          // Wait until the mutex is available without locking it
          await mutex.waitForUnlock();
          return await restApiRequest(method, url, data); // Retry the original request after token refresh
        }
      } else if (error.response.status === 500) {
        // Handle specific server errors as needed
        store.dispatch(setEventTriggered('INTERNAL_ERROR'));
      } else if (error.response.status === 404) {
        // Handle specific "Not Found" errors as needed
        store.dispatch(setEventTriggered('NOT_FOUND'));
      }
    }
    throw error; // Rethrow other errors
  }
};

export default restApiRequest;
