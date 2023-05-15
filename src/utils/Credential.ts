import { getDataStorage } from './sessionStorage';
interface IGetCredential {
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

export const getCredential = (): IGetCredential => {
  const accessToken = getDataStorage('accessToken') || '';
  const refreshToken = getDataStorage('refreshToken') || '';
  const roles = getDataStorage('roles') || [];

  return {
    accessToken,
    refreshToken,
    roles,
  };
};

export const removeCredential = () => {
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('roles');
};
