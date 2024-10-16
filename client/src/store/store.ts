import { configureStore } from '@reduxjs/toolkit';
import { UserApi } from './api/user.api';
import authReducer from './slice/auth.slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { DocumentApi } from './api/document.api';
import { DealHistoryApi } from './api/dealHistory';
import { NotificationsApi } from './api/notifications.api';
import { AdminApi } from './api/admin.api';

export const store = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        users: authReducer,
        [DocumentApi.reducerPath]: DocumentApi.reducer,
        [DealHistoryApi.reducerPath]: DealHistoryApi.reducer,
        [NotificationsApi.reducerPath]: NotificationsApi.reducer,   
        [AdminApi.reducerPath]: AdminApi.reducer
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(
            UserApi.middleware, DocumentApi.middleware, DealHistoryApi.middleware, NotificationsApi.middleware, AdminApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
