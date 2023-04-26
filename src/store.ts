import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
// config the store
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// export default the store
export type RootState = ReturnType<typeof store.getState>;
