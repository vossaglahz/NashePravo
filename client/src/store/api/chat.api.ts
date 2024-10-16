import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ChatApi = createApi({
    reducerPath: 'chatHistory',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/chat',
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
        getMessageHistory: build.mutation({
            query: ({opponentId}) => {
                const params = new URLSearchParams({
                    opponentId
                });
                return {
                    url: `?${params.toString()}`,
                    method: 'GET',
                    credentials: 'include',
                };
            },
        }),
    }),
});

export const {useGetMessageHistoryMutation} = ChatApi;