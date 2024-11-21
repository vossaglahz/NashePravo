import { configureStore } from '@reduxjs/toolkit';
import { UserApi } from './api/user.api';
import authReducer from './slice/auth.slice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { DocumentApi } from './api/document.api';
import { DealHistoryApi } from './api/dealHistory';
import { NotificationsApi } from './api/notifications.api';
import { AdminApi } from './api/admin.api';
import { RatingApi } from './api/rating.api';
import { ToDoApi } from './api/todo.api'; // Добавьте импорт ToDoApi
import { OpenAiApi } from './api/openAI.api';

export const store = configureStore({
    reducer: {
        [UserApi.reducerPath]: UserApi.reducer,
        users: authReducer,
        [DocumentApi.reducerPath]: DocumentApi.reducer,
        [DealHistoryApi.reducerPath]: DealHistoryApi.reducer,
        [NotificationsApi.reducerPath]: NotificationsApi.reducer,   
        [AdminApi.reducerPath]: AdminApi.reducer,
        [RatingApi.reducerPath]: RatingApi.reducer,
        [ToDoApi.reducerPath]: ToDoApi.reducer, // Добавьте запятую здесь
        [OpenAiApi.reducerPath]: OpenAiApi.reducer,
    },
    middleware: getDefaultMiddleware => 
        getDefaultMiddleware().concat(
            UserApi.middleware, 
            DocumentApi.middleware, 
            DealHistoryApi.middleware, 
            NotificationsApi.middleware, 
            AdminApi.middleware, 
            RatingApi.middleware,
            ToDoApi.middleware, // Добавьте ToDoApi.middleware здесь
            OpenAiApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
