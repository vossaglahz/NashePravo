import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INotifications, INotify } from '../../interfaces/Notifications.interface';

export const NotificationsApi = createApi({
    reducerPath: 'notificationsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_BACK}/notifications`,
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
        getAllGeneralNotifications: build.query<
            {
                totalCount: number;
                notifications: INotify[];
            },
            {
                currentPage: number;
                important: string;
                sorted: string;
            }
        >({
            query: ({ currentPage, important, sorted }) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    important,
                    sorted,
                });
                return {
                    url: `/general?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        getAllPersonalNotifications: build.query<
            {
                totalCount: number;
                notifications: INotify[];
            },
            {
                currentPage: number;
                sorted: string;
            }
        >({
            query: ({ currentPage, sorted }) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    sorted,
                });
                return {
                    url: `/personal?${params.toString()}`,
                    method: 'GET',
                };
            },
        }),
        getAllProcessingQuestions: build.query({
            query: ({ role, currentPage, sorted, status }) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    role,
                    sorted,
                    status,
                });
                return {
                    url: `/personal?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
        sendPersonalNotification: build.mutation<
            INotifications,
            {
                topic: string;
                content: string;
                sourceLink: string | null;
                role?: string;
                toAdmin?: boolean;
                answered?: boolean;
                userId?: number;
                lawyerId?: number;
                questionId?: number;
            }
        >({
            query: data => ({
                url: '/personal',
                method: 'POST',
                body: data,
            }),
        }),
        sendGlobalNotification: build.mutation<INotifications, { topic: string; content: string; important: boolean; sourceLink: string | null; targetAudience: string }>({
            query: data => ({
                url: `/general?targetAudience=${data.targetAudience}`,
                method: 'POST',
                body: data,
            }),
        }),
        getUnreadNotificationsCount: build.query<
            {
                unreadPersonalCount: number;
                unreadGeneralCount: number;
                totalUnreadCount: number;
            },
            void
        >({
            query: () => ({
                url: `/count`,
                method: 'GET',
            }),
        }),
        markPersonalAsViewed: build.mutation<void, { notificationId: number }>({
            query: ({ notificationId }) => ({
                url: `/personalMark`,
                method: 'PUT',
                body: { notificationId },
            }),
        }),
        markGeneralAsViewed: build.mutation<void, { notificationId: number }>({
            query: ({ notificationId }) => ({
                url: `/generalMark`,
                method: 'PUT',
                body: { notificationId },
            }),
        }),
    }),
});

export const {
    useSendGlobalNotificationMutation,
    useGetAllGeneralNotificationsQuery,
    useSendPersonalNotificationMutation,
    useGetAllProcessingQuestionsQuery,
    useGetAllPersonalNotificationsQuery,
    useGetUnreadNotificationsCountQuery,
    useMarkGeneralAsViewedMutation,
    useMarkPersonalAsViewedMutation,
} = NotificationsApi;
