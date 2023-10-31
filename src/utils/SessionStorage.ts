import { store } from "@/store";
import { removeCredential } from "./Credential";
import { setAccessToken, setRefreshToken, setRoles } from "@/services/Login/slice";
import { openToast } from "@/components/atoms/Toast/slice";

export const storeDataStorage = (key: string, value: any) => {
  const now = new Date();
  const expiry = localStorage.getItem('expiry');
  if (!expiry) {
    localStorage.setItem('expiry', JSON.stringify(now.getTime() + 43200000));
  };

  const jsonValue: any = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

export const getDataStorage = (key: string) => {
  const now = new Date();
  const expiry = localStorage.getItem('expiry');
  if (expiry && (now.getTime() > JSON.parse(expiry))) {
    removeCredential();
    store.dispatch(setAccessToken(''));
    store.dispatch(setRefreshToken(''));
    store.dispatch(setRoles([]));
    store.dispatch(
      openToast({
        type: 'error',
        title: 'Oops',
        message: 'Failed renew token',
      }),
    );

    return null;
  };

  const value: any = localStorage.getItem(key);
  if (value) return JSON.parse(value);
};
