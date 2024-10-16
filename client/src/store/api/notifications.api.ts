import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INotifications, INotify } from '../../interfaces/Notifications.interface';

export const NotificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/notifications',
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: build => ({
        getAllGeneralNotifications: build.query<INotify[], void>({
            query: () => ({
                url: '/general',
                method: 'GET'
            }),
        }),
        getAllPersonalNotifications: build.query({
            query: ({ role, currentPage, questionDate, status }) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    role,
                    questionDate,
                    status
                });
                return {
                    url: `/personal?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            }
        }),
        sendPersonalNotification: build.mutation<INotifications, { topic: string; content: string, role?: string, toAdmin?: boolean, answered?: boolean, userId?: number, lawyerId?: number, questionId?: number }>({
            query: data => ({
                url: '/personal',
                method: 'POST',
                body: data,
            }),
        }),
        sendGlobalNotification: build.mutation<INotifications, { topic: string; content: string, important: boolean }>({
            query: data => ({
                url: '/general',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { 
    useSendGlobalNotificationMutation, 
    useGetAllGeneralNotificationsQuery, 
    useGetAllPersonalNotificationsQuery, 
    useSendPersonalNotificationMutation, 
} = NotificationsApi;
