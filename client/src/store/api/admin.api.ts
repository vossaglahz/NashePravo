import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { INotifications } from '../../interfaces/Notifications.interface';
import { ILawyer } from '../../interfaces/Lawyer.interface';
import { IUser } from '../../interfaces/User.interface';

export const AdminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/admin',
        credentials: 'include',
        prepareHeaders: headers => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: build => ({
        getSomeUser: build.query<{
            count: number;
            data: IUser[] | ILawyer[];
        }, {
            currentPage: number;
            isActivatedByEmail: string;
            isConfirmed: string;
            sorted: string;
            role: string;
            permanentBlock: string;
        }>({
            query: ({ currentPage, isActivatedByEmail, isConfirmed, sorted, role, permanentBlock}) => {
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    isActivatedByEmail,
                    isConfirmed,
                    sorted,
                    role,
                    permanentBlock
                });
                return {
                    url: `/users?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
        sendGlobalNotification: build.mutation<INotifications, { topic: string; content: string, important: boolean }>({
            query: data => ({
                url: '/general',
                method: 'POST',
                body: data,
            }),
        }),
        sendPrivate: build.mutation<INotifications, { theme: string; text: string, global: boolean, userId: number, lawyerId: number, adminId: number, role: string}>({
            query: data => ({
                url: '/private',
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSendGlobalNotificationMutation, useGetSomeUserQuery } = AdminApi;