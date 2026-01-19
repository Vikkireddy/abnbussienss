import { configureStore } from '@reduxjs/toolkit';
import { businessApi } from './api/businessApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      [businessApi.reducerPath]: businessApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(businessApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

