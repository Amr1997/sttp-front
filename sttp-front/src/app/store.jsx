import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import { authApi } from '../api/authApi';
import { audioApi } from '../api/audioApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [audioApi.reducerPath]: audioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, audioApi.middleware),
});

export default store;
