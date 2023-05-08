import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import navbarSlice from './components/molecules/Navbar/slice';
import layoutSlice from './components/organisms/Layout/slice';
// config the store
export const store = configureStore({
  reducer: {
    navbarSlice,
    layoutSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware),
});

// export default the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
