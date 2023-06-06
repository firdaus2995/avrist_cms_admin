import { 
  configureStore,
} from '@reduxjs/toolkit';
import { 
  useDispatch, 
  useSelector,
} from 'react-redux';
import type { 
  TypedUseSelectorHook,
} from 'react-redux';

import { 
  loginApi,
} from './services/Login/loginApi';
import { 
  rolesApi,
} from './services/Roles/rolesApi';
import { 
  userApi,
} from './services/User/userApi';
import navbarSlice from './components/molecules/Navbar/slice';
import layoutSlice from './components/organisms/Layout/slice';
import loginSlice from './services/Login/slice';
import rolesSlice from './services/Roles/rolesSlice';
import toastSlice from './components/atoms/Toast/slice';
export const store: any = configureStore({
  reducer: {
    layoutSlice,
    navbarSlice,
    loginSlice,
    rolesSlice,
    toastSlice,
    [loginApi.reducerPath]: loginApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(loginApi.middleware)
      .concat(rolesApi.middleware)
      .concat(userApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
