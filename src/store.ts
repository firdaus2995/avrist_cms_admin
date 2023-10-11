import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import { loginApi } from './services/Login/loginApi';
import { rolesApi } from './services/Roles/rolesApi';
import { userApi } from './services/User/userApi';
import { pageManagementApi } from './services/PageManagement/pageManagementApi';
import { pageTemplateApi } from './services/PageTemplate/pageTemplateApi';
import { menuApi } from './services/Menu/menuApi';
import { contentTypeApi } from './services/ContentType/contentTypeApi';
import { emailFormBuilderApi } from './services/EmailFormBuilder/emailFormBuilderApi';
import { contentManagerApi } from './services/ContentManager/contentManagerApi';
import { configApi } from './services/Config/configApi';
import { globalConfigDataApi } from './services/GlobalConfigData/globalConfigDataApi';
import { notificationApi } from './services/Notification/notificationApi';
import { departmentApi } from './services/Department/departmentApi';

import navbarSlice from './components/molecules/Navbar/slice';
import layoutSlice from './components/organisms/Layout/slice';
import loginSlice from './services/Login/slice';
import rolesSlice from './services/Roles/rolesSlice';
import toastSlice from './components/atoms/Toast/slice';
import pageManagementSlice from './services/PageManagement/pageManagementSlice';
import notificationSlice from './services/Notification/notificationSlice';
import eventErrorSlice from './services/Event/eventErrorSlice';

export const store: any = configureStore({
  reducer: {
    layoutSlice,
    navbarSlice,
    loginSlice,
    rolesSlice,
    toastSlice,
    pageManagementSlice,
    notificationSlice,
    eventErrorSlice,
    [loginApi.reducerPath]: loginApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [pageManagementApi.reducerPath]: pageManagementApi.reducer,
    [pageTemplateApi.reducerPath]: pageTemplateApi.reducer,
    [contentTypeApi.reducerPath]: contentTypeApi.reducer,
    [emailFormBuilderApi.reducerPath]: emailFormBuilderApi.reducer,
    [contentManagerApi.reducerPath]: contentManagerApi.reducer,
    [configApi.reducerPath]: configApi.reducer,
    [globalConfigDataApi.reducerPath]: globalConfigDataApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(loginApi.middleware)
      .concat(rolesApi.middleware)
      .concat(userApi.middleware)
      .concat(menuApi.middleware)
      .concat(pageManagementApi.middleware)
      .concat(pageTemplateApi.middleware)
      .concat(contentTypeApi.middleware)
      .concat(contentManagerApi.middleware)
      .concat(emailFormBuilderApi.middleware)
      .concat(configApi.middleware)
      .concat(globalConfigDataApi.middleware)
      .concat(notificationApi.middleware)
      .concat(departmentApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
