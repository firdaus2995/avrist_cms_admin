import axios, { AxiosResponse } from 'axios';
import { Mutex } from 'async-mutex';
import { store } from '../store';
import { getCredential, removeCredential } from './Credential';
import { loginApi } from '../services/Login/loginApi';
import { storeDataStorage } from './SessionStorage';
import { openToast } from '../components/atoms/Toast/slice';
import { setRefreshToken, setAccessToken, setRoles } from '../services/Login/slice';
import { baseRedirectAdminLogin } from '@/constants/common';

const baseUrl = import.meta.env.VITE_API_URL;
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

const restApiRequest = async (
  method: string,
  url: string,
  data: any = null,
  responseType: 'json' | 'blob' = 'json',
): Promise<any> => {
  try {
    const requestConfig = {
      method,
      url,
      responseType, // set tipe data yg ingin diambil
      data: responseType === 'blob' ? null : data, // ini untuk post payload
    };

    // contoh get
    // const jsonData = await restApiRequest('GET', '/api/endpoint', null, 'json');
    // const blobData = await restApiRequest('GET', '/api/image', null, 'blob');
    // contoh post
    // const jsonResponse = await restApiRequest('POST', '/api/post-endpoint', postData, 'json');
    // const blobResponse = await restApiRequest('POST', '/api/post-image', postData, 'blob');

    const response: AxiosResponse = await axiosInstance.request(requestConfig);
    if (response.status === 200) {
      return response;
    } else {
      console.log(response.status);
    }
  } catch (error: any) {
    console.log(error)
    if (error.response) {
      const statusCode = error.response.status;
      if (statusCode === 401 || statusCode === 403) {
        if (!mutex.isLocked()) {
          const release = await mutex.acquire();
          try {
            const token = getCredential().refreshToken;
            const refreshResult = await store
              .dispatch(loginApi.endpoints.refreshToken.initiate({ token }))
              .unwrap();
            if (refreshResult?.refreshToken) {
              store.dispatch(setAccessToken(refreshResult.refreshToken.accessToken));
              store.dispatch(setRefreshToken(refreshResult.refreshToken.refreshToken));
              store.dispatch(setRoles(refreshResult.refreshToken.roles));
              storeDataStorage('accessToken', refreshResult.refreshToken.accessToken);
              storeDataStorage('refreshToken', refreshResult.refreshToken.refreshToken);
              storeDataStorage('roles', refreshResult.refreshToken.roles);
              return await restApiRequest(method, url, data); // Retry the original request after token refresh
            } else {
              handleTokenRefreshFailure();
            }
          } catch (err) {
            handleTokenRefreshFailure();
          } finally {
            release();
          }
        } else {
          await mutex.waitForUnlock();
          return await restApiRequest(method, url, data); // Retry the original request after token refresh
        }
      } else if (statusCode === 500) {
        console.log('REST_INTERNAL_ERROR');
      } else if (statusCode === 404) {
        console.log('NOT_FOUND');
      }
    }
    throw new Error(`API request failed: ${error.message}`);
  }
};

const handleTokenRefreshFailure = () => {
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
  window.location.assign(baseRedirectAdminLogin);
};

export default restApiRequest;
