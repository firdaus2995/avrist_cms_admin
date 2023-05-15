import { configureStore } from '@reduxjs/toolkit';
import { loginApi } from './services/Login/loginApi';
import { rolesApi } from './services/Roles/rolesApi';
import navbarSlice from './components/molecules/Navbar/slice';
import layoutSlice from './components/organisms/Layout/slice';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
export const store = configureStore({
  reducer: {
    layoutSlice,
    navbarSlice,
    [loginApi.reducerPath]: loginApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(loginApi.middleware).concat(rolesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
