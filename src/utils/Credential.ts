import { getDataStorage } from './SessionStorage';
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
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('roles');
  localStorage.removeItem('expiry');
};
